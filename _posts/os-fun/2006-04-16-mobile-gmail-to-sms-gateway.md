---
layout: post
category : hacking
tags : [hacking, software-development]
---
{% include JB/setup %}

## What is it?
MobiGM is a small utility that periodically checks your GMail inbox, and sends updates to a mobile phone via email. Certainly, you could just set up a couple filters with GMail's powerful filtering system to forward messages to your phone and be happy with that, but MobiGM allows you to dynamically react to what appears in your mailbox (which we will exploit in future projects).	

##Technologies used/Requirements:

- GMail / atom feeds
- PERL
- XML::Parser
- Net::SMTP
- cron
- Linux
- BASH
- wget

##How does it work?
GMail users can subscribe to an atom feed that contains unread emails in their inbox. We will write a simple script to download the atom feed, parse it, figure out if any emails are new, and forward the new emails to our cell phone address. Note that there are still some pay-as-you-go cellphone providers that do not charge for receiving text messages (even from email), so this can be a very inexpensive way to keep track of your inbox on the go.

There is a lot of potential to add power to this application. With a little knowledge of PERL, you could create custom filters (including things impossible with GMail filters such as "only forward during xx hours of the day") and reactions to receiving emails.

Let's begin.

##Receiving the feed
Note: You could do this also in PERL. I'm doing it in wget.

The first thing the script needs to do, is receive the atom feed for your GMail inbox. We will use GNU wget to obtain the feed. In it's most basic form, wget's syntax is:

	wget <url>

However, we need to specify a few additional parameters, namely HTTP authentication username and password. As well, we want to force wget to always download to the same filename. It's normal action is to not overwrite files that already exist, so we have to override it. So, the syntax becomes:

	wget -O <output file> <url> --http-user=<username> --http-password=<password>

For GMail, the parameters are as follows:

- URL: https://mail.google.com/gmail/feed/atom
- http-user : your.e.mail@gmail.com
- http-password: your gmail password

Note that since the atom feed is on an https server, we are not passing our username/password in the clear.

For the article, let's force wget to save into a file called 'atomfeed'. Our command is now:

	wget -O atomfeed https://mail.google.com/gmail/feed/atom --http-user=gmail.user@gmail.com --http-password=GMailPassword

Now that we have the atom feed, it is time to parse it.

##Parsing the Atom feed
We will use a short PERL script to parse the atom feed, and forward pertinent messages to the cellphone.

Atom feeds are conceptually the same as RSS feeds, in case you have not heard of both. They are XML documents that contain a summary of information: ie, blog entries, news entries, or in this case, your unread messages in your inbox. The structure of the GMail atom feed is as follows:

feed - top level tag
fullcount - Number of unread emails
entry - tag for each unread email
title - Email subject line
id - Unique identifier for each inbox entry
summary - Short snippet of email contents
author - Parent tag for source's information
email - Author's email
name - Author's name

Since the atom feed is a properly formatted XML document, we will use the PERL module XML::Parser to parse the data. First, we'll set up some variables for parsing and for keeping track of our state.

	#!/usr/bin/perl -w
	
	use XML::Parser;
	use Net::SMTP;
	
	open(ATOM, "atomfeed") or die ("Failed to get atomfeed");
	
	my $page;
	
	#load the atom feed
	while ($line = ) {
		$page = $page . $line;
	}
	close(ATOM);

	my $curID = "";
	my $curTitle = "";
	my $curContents = "";
	my $curAuthor = "";
	my $curAuthorEmail = "";

	my $elementtext;
	my @context;
	my @oldIDs;
	my @newIDs;

	my $parser = new XML::Parser();

The code's pretty self explanitory. We load the atom feed into the $page variable. For use with the parsing functions, we initialize five variables ($curID. $curTitle, $curContents, $curAuthor, $curAuthorEmail) used to keep track of the entry currently being parsed. As well we create variables to keep track of our parsing state ($elementtext and @context). Ignore the ID-related variables, we'll deal with them later.

Our next step is to use XML::Parser to parse the atom feed. This is accomplished by the following code:

	$parser->setHandlers(
		Start => \&startTag,
		Char => \&parseTag,
		End => \&endTag, );

	$parser->parse($page);

What we've done is told the XML parser to use three supplied subroutines (passed by reference) as callbacks during parsing. The startTag routine will be called whenever the parser encounters a new tag. Likewise, the parseTag routine is called as we encounter text in each tag, and the endTag routine is called whenever the parser encounters the end of a tag. The final line of the snippet executes the parser, parsing the atom feed using our supplied functions.

We have to supply these subrountines, since they detail how we deal with the data we're parsing. Put these at the bottom of the perl script since they're separate subrountines.

	sub startTag {
		my ($p, $tag, %atts) = @_;
		push @context, $tag;
	}
	
	sub parseTag {
		my ($p, $text) = @_;
		return if ($text !~ /\S/);
		$text =~ s/^\s*//;
		$text =~ s/\s*^//;
		$elementtext .= $text;
	}
	
	sub endTag {
		my ($p, $tag) = @_;

		$parentElem = $context[-2];

		if ($tag eq "id" &&amp; $parentElem eq "entry") {
			$curID = $elementtext;
		} elsif ($tag eq "title" &&amp; $parentElem eq "entry") {
			$curTitle = $elementtext;
		} elsif ($tag eq "summary" && $parentElem eq "entry") {
			$curContents = $elementtext;
		} elsif ($tag eq "email" &&amp; $parentElem eq "author") {
			$curAuthorEmail = $elementtext;
		} elsif ($tag eq "name" &&amp; $parentElem eq "author") {
			$curAuthor = $elementtext;
		} elsif ($tag eq "entry") {
			push @newIDs, $curID;
			my $old = 0;
		
			sendMail("Subject:$curTitle\n\nFrom:$curAuthorEmail [$curAuthor]\n$curContents");
		
		}
		$elementtext = "";
		pop @context;
	}

The startTag and parseTag subroutines are trivial. We're using the @context array as a stack to keep track of our state within the parser. Each time we enter a tag and begin to parse it's children or data, we push the element name onto the stack. We use this in the endTag subroutine to determine what to do with the parsed text. The parseTag subroutine, which is run during the parsing of data nodes, appends whatever data is supplied to the routine to the $elementtext variable (which will be used in endTag.

The endTag subroutine looks at the current context in the node tree and saves the current $elementtext to the proper variable. Whenever we encounter the end of an entry tag, we send the email to the server. This is a dirty solution: a nicer solution would be to save all the entry data into a data structure and later deal with each entry saved (an exercise for the reader ;) ). The final thing the procedure does is pop the finished tag off the @context stack and clear the $elementtext buffer.

Note that if you want to change the format of the sent email, change the formatting in the sendMail function call, above.

##Sending the Email
As shown in endTag, we use sendMail to send the email to the cellphone. The source code is as follows:

	sub sendMail {
		
		my @message;
		push @message, $_[0];

		$smtp2 = Net::SMTP->new('smtp.server.ca');
		
		$smtp2->mail('source.email@isp.ca');
		$smtp2->to('cellphoneemail@provider.com');
		$smtp2->data();
		$smtp2->datasend(@message);
		$smtp2->dataend();
		$smtp2->quit;
		
	}

sendMail just uses the Net::SMTP module to send an email. You need to provide a SMTP server, source email address, and your cellphone's email address.

##What about duplicates?!?!
There's a major flaw with our current solution: every time our perlscript runs, it will send an email for all unread messages in our mailbox! That means that, until we read the messages, we will receive text messages every n minutes for the same messages. Obviously this is unsuitable!

##Solution
We will save the ID's of messages we have notified the cellphone of in a file. Before emailing the cellphone, we will compare with a saved list of ID's for messages that we have already sent to the cellphone. That way, the phone only receives notification of new emails.

The first step is to load all the old ID's into an array. Place the code snippet below after the variable declaration (first snippet) and before the parser initialization (second snippet)

	#load the previous inbox ID's
	open(OLDID, "ids.old");
	while ($line = ) {
		chomp $line;
		push @oldIDs, $line;
	}
	close(OLDID);

We open the file 'ids.old' (assumably saved by a previous run of the script), and load each line of the file into an array. We will modify endTag to look through this array before determining whether or not it should send the email address, by changing the function's code as follows:


	sub endTag {
		my ($p, $tag) = @_;
		
		$parentElem = $context[-2];
		
		if ($tag eq "id" &&amp;amp; $parentElem eq "entry") {
			$curID = $elementtext;
		} elsif ($tag eq "title" &&amp;amp; $parentElem eq "entry") {
			$curTitle = $elementtext;
		} elsif ($tag eq "summary" && $parentElem eq "entry") {
			$curContents = $elementtext;
		} elsif ($tag eq "email" &&amp;amp; $parentElem eq "author") {
			$curAuthorEmail = $elementtext;
		} elsif ($tag eq "name" &&amp;amp; $parentElem eq "author") {
			$curAuthor = $elementtext;
		} elsif ($tag eq "entry") {
			push @newIDs, $curID;
			my $old = 0;
			#was email in oldids?
			foreach $id (@oldIDs) {
				if ($curID eq $id) {
					$old = 1;
				}
			}
			if ($old == 0) {
				sendMail("Subject:$curTitle\n\nFrom:$curAuthorEmail [$curAuthor]\n$curContents");
			}
		}
		$elementtext = "";
		pop @context;
	}

As you can see, we are now comparing each entry's id to the loaded list of old ID's. Only if the id is not in the list do we notify the cell phone of the waiting message. As well, we are saving every message ID (old or new) in the array @newIDs.

The final thing to do is to re-write the 'ids.old' file to contain the message ID for all emails in our current feed. This code is placed after the $parser->parse line, making it the last thing that happens in our main routine (and immediately above our subroutine code).

	open(NEWID, ">ids.old");
	foreach $id (@newIDs) {
		print NEWID $id . "\n";
	}
	close(NEWID);

##Putting it all together
We want a single command to run to complete both functions (download and parse the atom feed). So, save the perlscript as 'mail.pl' and make a small shell script called run.sh:

	#!/bin/sh
	
	wget -O atomfeed https://mail.google.com/gmail/feed/atom --http-user=gmail.user@gmail.com --http-password=gmailPassword
	./mail.pl

Test this out. If it doesn't work, try adding debugging statements in the code to see where/why it fails.

##Automation
The last thing to do is to automate the script so it runs periodically. For this you need to be running a cron daemon. There's a large variety of daemons available, each with it's own method of configuration. For Gentoo users, we can do the following (as root):

	host user # crontab -e

Then add a line to the crontab file such as:

	0,15,30,45 * * * * /home/th0mas/mobigm/run.sh

This tells the server to run the script 0, 15, 30, and 45 minutes after every hour.

##Ideas
It'd be easy to set up custom filters, for example you could compare the author's name to a whitelist, or ensure that it is currently a specific time of day (or do that automation with the crontab). Or you could modify the code to look at other RSS or atom feeds to notify your cellphone of a new blog update.

##Download
You can download a copy of the files we've created in this entry here:
http://th0mas.xbox-scene.com/tuts/mobigm-1.tgz

##Feedback
This is the first tutorial I've written in awhile. Please let me know if I should expand on detail in places, or be more terse in others. I'll be reading the comments.


