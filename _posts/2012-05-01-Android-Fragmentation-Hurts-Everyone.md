---
layout: post
category : development
tags : [development, android]
description : How hardware fragmentation on Android devices hurts users and developers.

---
{% include JB/setup %}

This past Friday I released an update to the Android version of DJPad fixing a critical show-stopper bug.  This bug would cause DJPad to lock up every time a user selected to load a song and chose any partition other than "/mnt/sdcard/".  It probably affected a significant portion of the 150+ users who download and immediately delete DJPad on a daily basis.  So why didn't I fix it sooner?

It doesn't happen on any of my Android devices.

My app runs great on my phone and my tablet.  No screen issues, no audio jitter, some multitouch issues as my phone is a 1.5-touch and not a true multitouch system.

Too bad that represents ~0.02% of the existing hardware devices that can install DJPad.

Based on the 1-star reviews my app receives, with my success I feel somewhat of a minority.  It's common to receive reviews such as "App does not work!!!!" and "Bug!!!" without any follow-up support email or tangible evidence I can use to fix the issue.  From my users I receive anger, not details.  And I can't really blame them.

And that really is the summary of the problem with Android today.  While the OS fragmentation isn't great, it's a smaller story than the pain experienced by Android users & developers due to the hardware fragmentation.

With the critical bug I fixed this week, I have over 15 stack traces and reports from users regarding the problem.  Not one of them told me what they were doing when they experienced the problem.  I had a message in spanish that translated to "the bug is a piece of crap" and many messages that said "Bugggg!", but it wasn't until my friend and fellow software developer tried DJPad and showed me the issue in person that I had enough details to fix the issue (which I then resolved and shipped in 3 hours that same Friday evening).

Take a look at this Stack Overflow question: [http://stackoverflow.com/questions/5694933/find-an-external-sd-card-location]

There is no API to get a complete list of mount points where a user may have saved their MP3s.  The solution today is to parse /proc/mounts and then hand-write filters to filter out all of the system mounts.  While the /mnt/sdcard point is semi-standard it is incomplete for devices that are USB hosts or have a second SD card or sizeable internal storage...

And this is far from the only bug.  From performance issues (some devices can't do the throughput necessary to load an MP3 while playing audio), latency (some devices don't give realtime access to the audio device), graphical (one user reports that they only see "half of the DJPad screen" and therefore cannot use the app), and random crashing, there is no end in sight to the different problems experienced by different devices in this ecosystem.

But this is my fault for letting these incompatible devices install my app, right?  When I, as an Android application developer, publish my application I can restrict installation based on... screen size: extrasmall, small, normal, large, extralarge.

This is the true problem with Android fragmentation.  Apps don't work.  Users rightfully get mad.  Developers get mad.  I waste a ton of time fixing Android-specific bugs.

As a victim of their own success I honestly think Google did not plan for this or they would have built more device filtering into the application manifest.

I probably spend twice as long per-feature on Android compared to Playbook or WebOS due to bugs encountered and supporting so many different screen sizes.  Which is funny, since the PlayBook version of my app well outsells the Android version.
