---
layout: post
category : business
tags : [business, sales]
description : Sales figures for my mobile DJ app DJPad for the first two months on the HP TouchPad and Android platforms.
---
{% include JB/setup %}

I started writing my first app [DJPad, a mobile dj app for Android, PlayBook, and HP TouchPad](http://www.burnsmod.com) for the HP TouchPad in December 2011.  It was released for sale on January 6th 2012 on the WebOS App Store.

##TouchPad?!?! Why would you develop for the HP TouchPad!?

I participated in the [TouchPad Developer Device Program](http://news.ycombinator.com/item?id=3199739) which gave me access to an HP TouchPad for ~$200 including shipping.  As an embedded C/C++ developer I was ecstatic when I realized the PDK development environment was based on [libSDL](http://www.libsdl.org), which I already knew from my ancient [OpenXDK/OpenDash work for the original XBox](http://th0mas.xbox-scene.com).

So, I had one.  For cheap.  And I've always wanted to get into audio app development, so I decided to attempt an MVP DJ application and DJPad was born.

Compared to the iOS market, HP TouchPad had only one competing app in the DJ market.  I priced my app at $2.99.

So was it worth it to develop for the HP TouchPad?  Let's look at the results:

## TouchPad sales: January 2012

![Jan 2012 Sales of DJPad on HP TouchPad](/blog/images/sales/djpad-sales-touchpad-jan2012.png)

The bump you see around Jan 20th was due to a software update and a forum post explaining my plans for the future.

*Total sales for Jan 2012: 117*

Payment comes from Palm via Paypal.  *For Jan 2012 my payment was $160.22.*

Why so low?  HP/Palm has this other column in their sales charts marked "Failed Transactions".  For the month of Jan my failed transaction count was 33.  I believe these are sales that ended up being to a bad CC or something similar and it's too bad this problem resulted in revenue lost.  It could otherwise be that my Jan payment period is not Jan 1st-30th?  I am not completely sure and to be honest it's only during writing this blog post that the discrepancy between chart sales and payout became apparent.

## TouchPad sales: February 2012

![Feb 2012 Sales of DJPad on HP TouchPad](/blog/images/sales/djpad-sales-touchpad-feb2012.png)

In February I reaped benefits of being a small fish in a small pond.  DJPad was featured in the US HP App Store for the month of February.  Mid-month, Palm contacted me with a deal: Halve the price of DJPad to $1.49 for a week, and they would include DJPad in an email sent to *all registered HP TouchPad users*.  That was an offer I could not really refuse.  That's the mid-month spike to >40 downloads/day.

*Total sales for Feb 2012: 281*

*Payment for Feb 2012 was: $366.98 USD*

Note that the payment is slightly under-reported as each region's payout only occurs when sales break $100.  I figured this out in March when I received a payment from both Palm US and Palm EU.

## Combo Effect: Android Port

With the available NDK and [Pelya's SDL Android Port](https://github.com/pelya/commandergenius) and a bunch of hackery I managed to port DJPad to Android.  It was released Feb 10th 2012.  I also released a free version of DJPad with Admob support for Android as an extra revenue stream.

The cool thing about the Android and HP TouchPad versions of DJPad is that they're the same codebase.  I call this the "combo effect": write once, sell multiple times.  Android has the further "combo effect" with multiple branded and walled storefronts such as the Amazon and Nook App stores.  DJPad is now in the Amazon App Store.  Unfortunately the Nook App store requires me to have a US Tax ID and I have not yet completed the necessary paperwork.  I had to fill out one form for HP/Palm, and for Amazon and Google I didn't have to fill out anything, so it's a shame that it's so hard for a non-US developer to release on the Nook.

Anyways, here's the Google sales, Amazon sales, and Admob revenue for Feb 2012:

<table border="1" cellspacing="0" cellpadding="10">
<tr><th>Vendor</th><th>Units</th><th>Revenue</th></tr>
<tr><td>Google</td><td>53</td><td>$82.03</td></tr>
<tr><td>Admob</td><td>-</td><td>$43</td></tr>
<tr><td>Amazon</td><td>73</td><td>$106.80</td></tr>
<tr><td>Total</td><td>126</td><td>$231.83</td></tr>
</table>


The Amazon sales experience is a bit quirky.  They can change the price of your app at their whim.  This seems to be net beneficial to me - when sales started to slip on the Amazon storefront, the computers dropped the DJPad price from $2.99 to $1.99.  The increased sales resulted in DJPad maintaining it's position as [#2 Paid Music App](http://www.amazon.com/gp/bestsellers/mobile-apps/2478854011/ref=pd_zg_hrsr_mas_1_3_last).

The other quirky thing about my Amazon experience is that despite steady sales and steady position, I've racked up [7 1-star reviews](http://www.amazon.com/Burns-Modular-DJPad/product-reviews/B007A687B6/ref=dp_top_cm_cr_acr_txt?ie=UTF8&showViewpoints=1).  This is by far the worst reviews I've gotten on any platform and yet sales have been steady.  It almost feels like a hired hit, but thankfully sales have remained steady.  It's very too bad that none of those reviews give even a little glimpse into the problems that the users experienced.

## Totals

<table border="1" cellspacing="0" cellpadding="10">
<tr><th>Month</th><th>Total Revenue</th></tr>
<tr><td>Jan 2012</td><td>160.22</td></tr>
<tr><td>Feb 2012</td><td>598.81</td></tr>
</table>

So my total revenue for the first two months of DJPad sales is: *$759.03*!  Not life changing yet, but a solid start to a profitable side business.

## Costs

It would be amiss to not mention the costs I've encountered to generate these profits.  I bought a used Mac laptop for *$250*, and spent *~$150* maxing the RAM and dropping in a 500gb hard drive.  I also bought the TouchPad for *~$200*.  As these are all fixed costs I don't really care to calculate my profit margin net these costs.

## Stay tuned!

I'll post more data for March and April, when I also released DJPad for the BlackBerry Playbook, and let me tell you, you're in for a surprise!
