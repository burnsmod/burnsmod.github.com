---
layout: post
category : business
tags : [business, resources]
description : A list of free hosting, email, analytics, and other services for use by programmers and startups.

---
{% include JB/setup %}

"There's no such thing as a free launch."

Is this still true?  Moreso today than ever before, we have professional-quality free (or trial) services available for use.

This post attempts to outline the available free web services for programmers and startups to use.

## Web - Domain

You still need to buy your domain, but you can save money.  Hackers from the 90s may remember a service that would allow you to register a free .com in return for banner advertising space, but that service disappeared in bubble-bust 1.0. 

To register domains on the cheap I suggest waiting for the periodic GoDaddy $1.99 1-year registration special.  Before you anti-GoDaddy activists complain, realize registering your domain with GoDaddy for $1.99 causes a loss for them, which they want to recoup with service upgrades and domain renewals.  Transfer your domain before the first year is up and you've effectively stuck it to the man AND gotten a dirt-cheap domain.

## Hosting

Many hosting providers offer free tiers.  Most are not very suitable as their monthly transfer maximums are so low that a single front-page HackerNews article will take your site down.

For websites requiring a backend, I know of two options:

Amazon offers a [free Linux or Windows EC2 Micro Instance for a year](http://aws.amazon.com/free/).  Follow that link to see what's included in the Free usage tier - it is rather generous.  It's not powerful enough to run an unoptimized Django project under load, but you may get close using varnish for caching or offload most of your assets onto S3.

Heroku offers a [single web process for free](http://www.heroku.com/pricing#1-0).  Deploying with this option would make scaling simple as traffic increases as you can dynamically add web processes to your account.

For product or blog websites not needing a live backend, I suggest [Github Pages](http://pages.github.com).  I'm using it for my [entire BurnsMod website](https://www.github.com/burnsmod).  The site is written in a combination of HTML and [Markdown](http://daringfireball.net/projects/markdown/) which is then rendered to a set of static HTML pages.  Not having a back-end generally shortens page load time.

## Email

Once you have your domain, everyone's favorite web behemoth [Google offers free Google Apps for Domains for up to 10 people](http://www.google.com/apps/intl/en/group/index.html).  That link actually got a lot harder to find - the [Google Apps for Business](https://www.google.com/a/cpanel/premier/new3?hl=en) page only offers a free trial for 30 days.

## Analytics 

While there's a number of start-ups in the analytics field like [MixPanel](https://mixpanel.com/), I prefer [Google Analytics](http://analytics.google.com).  I like tools that are useful immediately after install (which in this case is just adding a small snippet of javascript to every page), and also offer advanced tools as I learn to utilize their full capabilities.

With the basic install Google Analytics will summarize your incoming traffic, inbound search keywords, and target demographics.  Integrate Google Analytics with [Google Webmaster Tools](https://www.google.com/webmasters/tools/home?hl=en) and you will also get to see a summary of impressions vs clicks for your website in Google search results.

For advanced SEO, [SEOMoz](http://www.seomoz.org) offers a 1-month free trial for their advanced SEO analytics.  I'm doing this now and find it tremendously helpful.  Starting with a full scan of your website, it gives you a laundry list of errors and warnings that would impact your search results.  What's even more impressive is the ability to enter your competitor's websites into a comparison chart comparing their estimated PageRank vs your own.  The membership costs $99/month after the first month, so while I think it'd be worth it for a larger corporation.. until then be sure to cancel your membership before the trial month is up unless you want to spend the $99/month.

For A/B testing, you can use [Google Website Optimizer](http://www.google.com/websiteoptimizer) even if you chose Jekyll to host your website statically.  GWO uses the Google Analytics javascript framework to register pageloads and conversions.  To start a test, add a javascript snippet to your variation pages and a separate snippet for your conversion goal, and your A/B test is implemented.  Very simple.

## Forum

Is there a good free hosted forum solution available today?  My customers were asking for one and I have not yet found a solution that was not ad-ridden.  Having a Favebook page helps but it doesn't really promote user-user interaction as much as it promotes user-brand promotion.  

## Development

Github is a innovator in social software development, but unless you become a paying customer you cannot commit your secret sauce as you are not allowed private repos as a free-tier user.  A GitHub competitor, [BitBucket](http://www.bitbucket.org) offers private repositories shared with up to 5 users at their free tier.  Perfect for off-site git repo hosting.

## Others?

There's other obvious services like [DropBox](http://www.dropbox.com) that you are already using.  Anything else I'm missing?  Add them to the comments here on the HN thread.




