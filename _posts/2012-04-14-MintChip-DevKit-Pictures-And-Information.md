---
layout: post
category : development
tags : [development, mintchip]
description : I received the development kit for the Royal Canadian Mint MintChip challenge today and thought some pics and details would be of interest to the community at large.

---
{% include JB/setup %}

I received the development kit for the Royal Canadian Mint MintChip challenge today and thought some pics and details would be of interest to the community at large.

Note: I never signed an NDA so as far as I know this is completely public knowledge.  If anyone has an objection to this post let me know.

## Pictures

The MintChip kit comes in a relatively sleek white package showing their "evolution of currency" logo.

![MintChip devkit in box](/blog/images/mintchip/mintchip-minou.jpg)

Inside the MintChip devkit is two MintChip smartcards.  The "USB dongle" for MintChip is just an off-the-shelf USB->MicroSD adapter with a silkscreened MintChip logo.

![MintChip devkit spread](/blog/images/mintchip/mintchip-spread.jpg)

They seem to have a running sense of humour, exemplified by the included "Do Not Disturb" sign

![MintChip devkit details](/blog/images/mintchip/mintchip-lol.jpg)

![MintChip devkit do not disturb](/blog/images/mintchip/mintchip-hotel.jpg)

Here's a shot of the components that come with the devkit:

![MintChip devkit components](/blog/images/mintchip/mintchip-adapters.jpg)


## MintChip Details

Mintchip currently has hardware APIs for Android, and Windows.  I'm on a Mac laptop for now so I am not running the API software.

When plugged into my Mac running Snow Leopard, the MintChip (via the USB->MicroSD adapter) registers as a mass storage device with a 2GB FAT16 partition:

	Mass Storage Device:

	          Capacity: 2.01 GB (2,014,838,784 bytes)
	          Removable Media: Yes
	          Detachable Drive: Yes
	          BSD Name: disk1
	          Product ID: 0x6335
	          Vendor ID: 0x058f  (Alcor Micro, Corp.)
	          Version:  1.03
	          Serial Number: --redacted--
	          Speed: Up to 480 Mb/sec
	          Manufacturer: Generic
	          Location ID: 0xfd100000 / 3
	          Current Available (mA): 500
	          Current Required (mA): 100
	          Partition Map Type: MBR (Master Boot Record)
	          S.M.A.R.T. status: Not Supported
	          Volumes:
	            Untitled:
	              Capacity: 2.01 GB (2,014,285,824 bytes)
	              Available: 2 GB (1,995,767,808 bytes)
	              Writable: Yes
	              File System: MS-DOS FAT16
	              BSD Name: disk1s1
	              Mount Point: /Volumes/Untitled

Alcor Micro is just the company of the USB->MicroSD adapter, so this gives us no new information on the design of the MintChip.

On the disk is a single file SMART_IO.CRD that looks like an interface to the "special" hardware on the chip.

	/Volumes/Untitled tom $ df | grep Untitled
	/dev/disk1s1     3933632     35648   3897984     1%    /Volumes/Untitled
	/Volumes/Untitled tom $ ls -al
	total 18752
	drwxrwxrwx  1 tom   staff    16384 14 Apr 17:38 .
	drwxrwxrwt@ 7 root  admin      238 14 Apr 17:38 ..
	drwxrwxrwx  1 tom   staff    32768 14 Apr 17:38 .Spotlight-V100
	drwxrwxrwx@ 1 tom   staff    32768 14 Apr 17:38 .Trashes
	-rwxrwxrwx  1 tom   staff     4096 14 Apr 17:38 ._.Trashes
	drwxrwxrwx  1 tom   staff    32768 14 Apr 17:38 .fseventsd
	-rwxrwxrwx  1 tom   staff  9437184 10 Mar 09:47 SMART_IO.CRD
	/Volumes/Untitled tom $ hexdump -C SMART_IO.CRD
	00000000  00 00 00 00 00 00 00 00  00 00 00 00 00 00 00 00  |................|
	*
	00900000
	/Volumes/Untitled tom $ 

Googling for SMART_IO.CRD finds some interesting discussion as people start poking around the system.

Like this post?  Maybe you'll like [DJPad, my mobile dj app for Android, PlayBook, and HP TouchPad](http://www.burnsmod.com).  Or consider [following me on twitter](http://www.twitter.com/BurnsMod)

.
