---
layout: post
category : hacking
tags : [hacking, reverse-engineering]
---
{% include JB/setup %}

In today's hack, we will analyze and modify a laptop BIOS image for fun and profit. Note that this is stupidly dangerous: a bad flash and we'll end up with a doorstop, or we'll have to remove the chip and reflash it manually. But in either case, the outcome can be fun.

## Technologies used/Requirements
- Laptop (I'm using a Toshiba Portege 3020ct)
- hex editor (I use ht)
- simple image editor (I used MS Paint - I had a reason!!)
- DEBUG.COM from The FreeDOS Project
- Linux


## DISCLAIMER #2
In some comments it appears people are thinking this is a generic method to modify any bios. It's not. It's the steps I had to take to modify mine. Yours will be different. Try using the same steps as me, but don't be suprised if you run into horrible problems such as compressed data. And again, don't do it unless your willing to brick it. I had a little faith since I did every step of the hack myself, but to you I'm just someone writing whatever he wants on a blog. Good luck :).

## DISCLAIMER
Don't follow this hack! You could destroy your laptop! Only risk what you can afford to lose. As well, don't be fooled by the success of my hack.. There are probably BIOS's out there that do their CRC check internally on every boot, and if the value is incorrect it won't boot up.. and this is something you'd only learn of after flashing the bad image! As well, many BIOS images when downloaded are probably compressed, leading to a much harder chase for something as trivial as changing the splashscreen. You've been warned.

## Overview
When I turn on my laptop, I'm greeted with a splashscreen advertising TOSHIBA. I'd like to change it to something custom to show off my elite-ness, so I've obtained a BIOS image from the Toshiba support page (available from here.

## Finding the Picture
The BIOS image represents a binary file that is completely foreign to us: we have no knowledge at this time of it's structure. A good first step in file format analysis is the most simplest: strings. strings is a command line utility that analyzes a byte stream and prints to stdout any ASCII strings it finds of length 4 or more characters. So, we run strings:

	# strings bios.com | more
	BIOS
	V8.10 3020CT
	BM&amp;amp;amp;amp;amp;amp;amp;amp;amp;amp;#
	wwww
	wwwwww
	www"www
	wwwwp
	wwwww
	wwwww
	wwwww
	=PAu
	=THu
	GG&;E
	_^Yt
	... (output truncated)

This looks at least somewhat promising: there are ASCII strings in the file. Often files are compressed, encrypted, or otherwise modified to hide the original data. So, what do we see:

BIOS - probably in the file header to identify itself as, well, a BIOS.
v8.10 3020ct - BIOS/laptop version string

From a first glance, we don't see anything else that is readable. However, let's think about a couple things:

- The splashscreen is displayed immediately upon boot
- It's embedded in the BIOS, not a lot of room for image decompression library or anything similiar

So, most likely, we're dealing with an uncompressed image. What's a popular uncompressed image type? You get a star if you answered "Windows Bitmap". And if we looked at a list of BMP file magics we would find out that BM&# is the file magic for a 16-color windows bitmap. Most likely this is the payload we need.

What we want to do now, is extract the payload into it's own file for modifications (using Paint). We need two peices of information: where does this image start (the offset), and it's size. Using our trusty hex editor, we find the BM&# magic appears at 0x100 (it's pretty obvious, we don't even have to search for it). For the size, let's just extract too much information, since another hidden fact of almost all image editing software is that they ignore data that comes after the end of a valid image (they read the data they need, and that is it). So we'll use a large number, such as 0x5900. We use 0x5900 since, if you look at the format of the bios file, around 0x6000 there is an obvious change in structure (a large series of null bytes all of a sudden into a stream of bytes with no apparent structure). We use the following C program to extract the data:

(save as ripimg.c)

	#include <string.h>
	
	// these are just guesses ;)
	
	#define IMG_START 0x100
	#define IMG_SIZE 0x5900
	
	typedef unsigned char uint8_t;

	int main(int argc, char **argv)
	{
		if (argc != 3) {
		   printf("Usage: %s <bios file> <output image>\n", argv[0]);
		}
		uint8_t *buf;
	
		FILE *in = fopen(argv[1], "rb");
		FILE *out = fopen(argv[2], "wb");
		buf = (uint8_t *) malloc(sizeof(uint8_t)*4000);
		
		fseek(in, IMG_START, SEEK_SET);
		
		int done = IMG_SIZE;
		while (done > 4000) {
			fread(buf, sizeof(uint8_t), 4000, in);
			fwrite(buf, sizeof(uint8_t), 4000, out);
			done-= 4000;
		}
		if (done) {
			fread(buf, sizeof(uint8_t), done, in);
			fwrite(buf, sizeof(uint8_t), done, out);
		}
		fclose(in);
		fclose(out);
	}

To compile, we run:

	gcc -o ripimg ripimg.c

And hope it compiles cleanly. Now, let's run this on our bios file. But first, let's make a backup: the last thing we want to do is inadvertently change a byte of the file, leading to a bad flash. So at every point we will diff our file in use against a clean backup to ensure we havn't mistakenly modified the bios. To run it, we execute:

	./ripimg biosfile img.out

Which writes img.out to the same directory. Opening img.out in an image editor, we find out.. SUCCESS! We've extracted the file!

## Modifying the image

The reason I used Paint to modify the image is that I wanted to ensure that the file format did not change in any way, shape, or form. I don't expect that the bios would be able to parse the embedded bitmap and act appropriately if a bitmap of anything but the exact same specifications were to appear. As well, we need the bitmap to be the exact same size as the embedded bitmap so that our modification does not overwrite any of the other data stored in the BIOS. So, we open and edit the bitmap to our liking within Paint, and save the final image as edited.bmp. Looking at edited.bmp, we see it's size is only 8998 bytes. That's because we had originally ripped out too much data to ensure we had read the entire bitmap.

## Injecting the image

Injecting is basically the inverse operation to ripping the image from the BIOS file. The biggest difference is that we have to be much more careful with respect to what we're doing, since we ARE modifying the bios image. Once we're done, we'll do some tests to (hopefully) ensure that we have changed the bitmap and only the bitmap. The injection code is as follows:

	#include <stdio.h>
	#include <string.h>
	
	typedef unsigned char uint8_t;
	
	// make no mistakes ;)
	#define FILE_SIZE 8998
	#define IMG_START 0x100
	
	int main(int argc, char **argv)
	{
		uint8_t *buf;
		FILE *in;
		FILE *out;
		int check;
		
		buf = (uint8_t *) malloc(sizeof(uint8_t)*FILE_SIZE);
		
		out = fopen(argv[1], "r+");
		in = fopen(argv[2], "r");
		fseek(out, IMG_START, SEEK_SET);
		check = fread(buf, sizeof(uint8_t), FILE_SIZE, in);
		if (check != FILE_SIZE) {
			printf("Error reading image\n");
			exit(1);
			fclose(in); fclose(out);
			}
		fwrite(buf, sizeof(uint8_t), FILE_SIZE, out);
		
		fclose(in);
		fclose(out);
	}

To run this, we execute it by:

	./injectimg biosfile edited.bmp

The file 'biosfile' now has the edited image embedded.

## Verifying the file

This is a laptop we're talking about, and we're risking it all just to change a splashscreen. That's sort of stupid. So let's be as safe as possible. Make another backup of this bios image (biosfile-2, let's call it). Now, we'll run a program to verify that the we modified no bytes other than those starting at 0x100 and ending at 0x100 + 8998 (the bitmap size). The code is as follows:

	#include <stdio.h>
	#include <string.h>
	
	typedef unsigned char uint8_t;
	
	#define FILE_SIZE 8998
	#define IMG_START 0x100
	
	int main(int argc, char **argv)
	{
		FILE *fp1;
		FILE *fp2;
		uint8_t buf1, buf2;
		int count = 0;
		int diff;
		
		fp1 = fopen(argv[1], "r");
		fp2 = fopen(argv[2], "r");
		
		while (!feof(fp1)) {
			fread(&buf1, sizeof(uint8_t), 1, fp1);
			fread(&buf2, sizeof(uint8_t), 1, fp2);
			if (buf1 != buf2) {
				if (count > IMG_START && count < IMG_START +FILE_SIZE) {
				} else {
					diff = ftell(fp1);
					printf("Difference at %08x!!\n", diff);
				}
			}
			count++;
		}
		fclose(fp1);
		fclose(fp2);
	}

To run, just pass as arguments the name of our original bios file, and the modified file. If the program does not output any text then it has run successfully and we only modified the image portion. Otherwise STOP, and restart the tutorial. The last thing to do is to ensure that our checkimg program did not itself modify our image, so we run 'diff' to make that assurance:

	# diff biosfile biosfile-2

##Flashing the Image

Alright! We've successfully modified the BIOS file, let's flash it and see the results! Enter a native DOS command prompt, run the chgbiosa.exe utility, and provide the filename of our newly modified BIOS file and...

...
......

Oh, dang, it doesn't work. CRC failure. Toshiba's one step ahead of us.

## File CRC

If we look at the bios file, it appears that the first 16 bytes or so is a header that does not get flashed. Assumably the CRC checksum is embedded in this header. Our problem is not finding the checksum in the BIOS, but rather.. how do we compute the proper checksum? There are a number of options, and I tried a number of different ideas before succeeding. I'll outline them below:

## Attempt 1
The use of the term "CRC" makes me believe that maybe they're using a standard CRC16 checksum algorithm. If we assume this is true, the only thing we need to know is the start/ending offsets for the portion that is CRC'd. I'm not going to walk you through this because it failed :), but what I did was I found the source code to a CRC routine, and wrote a brute force program that attempted to sum different portions of the valid bios file to obtain the required CRC magic. Like I said, it didn't work. After a couple days running 24/7 I decided to go for a nicer, smoother hack.

## Attempt 2
Attempt 2 also failed, but if it weren't for the target being a BIOS flashing utility it would have worked. Attempt 2 was to run the application inside DOSEMU, and to dump the entire memory region of the application before it exits (and after it has computed the CRC). Doing so with a valid BIOS file would return at least two positions in memory that would contain the correct 16 bit CRC value (the calculated value and the value loaded from the file). Then we'd do it with our modified file, look at the same offsets, and learn what the proper CRC value is for our modified BIOS.

The reason Attempt 2 failed is because, prior to loading the BIOS and calculating the CRC, the application detects that we are in Virtual Mode, assumes we're running it in a DOS box in Windows, and barfs because of that. We could get around this check by editing the application, but with that level of understanding we'd be able to just remove the CRC check altogether - which is what we're going to do.

## Attempt 3 - The Successful Attempt
Clever introductions aside, the program that saves the day is the version of DEBUG.COM that comes with FreeDOS. Using it, we can interactively debug the BIOS flashing utility from a native DOS shell (thus satisfying the application's VM checks). By interactively debugging on the laptop, while watching the assembly source on another computer, we should be able to determine where the application makes the fork in execution based on CRC pass/fail. So let's begin.

## Environment
Assumably, you aren't currently in a native DOS command shell on your laptop. Before rebooting, copy the files you need to a directory on your MSDOS partition. You will need:
- the modified BIOS file
- the chgbiosa.exe application
- debug.com, from the FreeDOS project.

Put these files in their own directory.

On your other computer, open chgbiosa.exe in HT, and change the mode to "mz/image". Our cursor is now at the starting point of execution for the program. On the laptop, run "debug chgbiosa.exe".

We will manually step through execution of the flashing program using the "proceed" command in DEBUG, shortcut "p". The "proceed" command is like GDB's "next" command, in that it steps over subroutines as opposed to into them. The application changes position of the cursor, so be ready. Keep going until we're executing the line:

	0E53:46BA E857FD CALL 4414

Note: Details aside, there is an offset difference of 0x200 between DEBUG.COM and HT's instruction addresses. It has to do with virtual addresses and segments in 16-bit mode.

Hit p again on this line, and in the middle of the screen you see "Input BIOS file name:". Obviously 4414 is the function that prints the prompt and asks for a filename, so enter our bios name.

It's a good idea to hit enter a number of times to push the cursor to the bottom of the screen whenever the application repositions it, effectively eliminating the annoying double text.

Anyways, we keep stepping until the line:

	0E53:46DD E8F9C9 CALL 12D9

Hit 'p' once more, and we see the error printed out "CRC Error". So we've found the subroutine that checks the CRC! Let's now use the 'trace' command to step into that subroutine and see what's going on. So, exit the debug session, and again execute "debug chgbiosa.exe". To save time we can execute right up to that call into the CRC subroutine, by giving the command:

	-G 46DD

That should position us at the line that calls the CRC routine. Now use the 't' command to enter the subroutine. You should be looking at the code at offset 12d9 in HT - this is the start of the CRC routine, and where we're currently positioned in DEBUG. Browse the code until you see the two 'ret' commands at 1448 and 144a. You should be able to see a pattern with the code up until that point: we test a word in memory against specific bits, and if it's not zero we iterate over a portion of the loaded BIOS file. That's all that happens until 0x1437 which is different as you see below:

	00001430 ac lodsb 
	00001431 e81700 call 0x144b 
	00001434 59 pop cx 
	00001435 e2f8 loop 0x142f <--- last looping command
	00001437 1f pop ds
	00001438 3b1e7801 cmp bx, [0178] <---- compare BX against a word in memory - this is "test computed vs stored" CRC values
	0000143c 7503 jnz 0x1441 <---- if different, jump to 0x1441
	0000143e eb09 jmp 0x1449 <---- else 0x1449
	00001440 90 nop
	00001441 bef402 mov si, 0x2f4
	00001444 e869f2 call 0x6b0 <---- print "CRC Error"
	00001447 f9 stc <---- set the carry flag to indicate CRC failure
	00001448 c3 ret <---- return
	00001449 f8 clc <---- clear carry flag to indicate success
	0000144a c3 ret <---- return 

All we're to do now, is modify the flow of execution so that we never return failure. So we modify the two bytes at 143c to two nop's, effectively forcing the flow of execution to return success. In HT, hit F4 to switch to Edit mode, and change the two bytes at 143c to both be equal to 0x90. The resulting assembly should look like the following:

	00001437 1f pop ds 
	00001438 3b1e7801 cmp bx, [0178] 
	0000143c 90 nop <-- changed to NOP's
	0000143d 90 nop
	0000143e eb09 jmp 0x1449
	00001440 90 nop
	00001441 bef402 mov si, 0x2f4
	00001444 e869f2 call 0x6b0
	00001447 f9 stc
	00001448 c3 ret
	00001449 f8 clc
	0000144a c3 ret 

Hit F4 to save, copy the new application to the laptop, and run (not in DEBUG!)! Success? You bet!

## Finale

My heart definitely stopped during the reboot cycle after reflashing, but it certainly was rewarding to see my new custom bootscreen appear. I hope you've enjoyed the hack, and hopefully learnt something about reverse engineering.


