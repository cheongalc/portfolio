---
title: Lessons from my 1st time interning in San Francisco
date: 2025-08-02
tags:
  - life-advice
  - internship
  - startup
  - sfo
  - vision-language-model
description: My first blog post + Life lessons from my internship at FlowState AI.
---
I recently concluded my internship at [FlowState AI](https://www.linkedin.com/company/flowstate-ai/). During this stint, I helped to build and evaluate a SOTA natural language video search pipeline. I am very grateful to the FlowState team for this opportunity, and want to share a bit about the experience + what I've learned. This 1st blog post is a little special to me as it marks the time I finally stopped procrastinating on setting up a proper personal website & blog, because [learning in public is good overall](https://www.swyx.io/learn-in-public). It also represents the beginning of an effort to write seriously so I can retrain my writing muscle, which I feel has atrophied significantly due to reliance on GenAI. So, no, you're not going to see emoji soup or an em dash every 3 sentences here because it's all written by me :)

Most of my time was spent in SF as the office was right next to Salesforce Park, but I was fortunate to experience quite a few places in South Bay and Berkeley as well. This was because it was my 1st time in the West Coast, so I attended many events around the Bay to meet new people. These included casual meetups at cafes/bars/university campuses/big tech HQ offices, build days at hacker houses, and conferences. Outside of the internship, the 3 highlights of my stay were
1. the [AI Engineer World's Fair](https://www.ai.engineer/), where I attended graphRAG/RL talks and had many serendipitous encounters with tech figures I admired,
2. the [YC AI Startup School](https://events.ycombinator.com/ai-sus), where it was nice to hear from a lineup of very high-profile speakers and meet other students with similar research interests, and
3. the [UC Berkeley AI Hackathon](https://ai.hackberkeley.org/), where my group built [a voice-controlled journaling app](#970f3fa2-650e-45ca-9d57-bb144390029d) that plots the activities going on in your life as a tree on a horizontal timeline.

I enjoy the electric and talent-dense tech community in SF. I was surprised to see so many tech ads on display when I landed in early May. There is no shortage of cool events and great people to learn from here; thank you to all who crossed paths with me & shared words of wisdom. I highly encourage anyone else planning their 1st visit to attend such events. [Luma](https://lu.ma/) & X are good starting points, and once you start meeting people, you can get introduced to more events via word of mouth.

I also appreciate the quaint architecture and interesting terrain which made me feel like I was in a movie. When the fog rolls in, there are many opportunities for moody shots, but when the sky is clear, the sunlight is beautiful. 


![Golden Gate Bridge](ggbridge.jpg)


[Crissy Field South Beach](https://maps.app.goo.gl/p42A73gNhKYWXhgz9) is a great place to view the Golden Gate Bridge because you'll see the sun set behind the bridge. The whole [east portion of the Presidio](https://maps.app.goo.gl/F9SKJzz7aZWzQNH57) is also really pretty and a serene picnic spot.


![SF Houses](houses.jpg)


[Corona Heights](https://maps.app.goo.gl/USwP4yzNkKGGEjvK6) is wonderful for viewing the fireworks on the 4th of July. The city shot fireworks from 2 barges, one at [Aquatic Park](https://maps.app.goo.gl/DLSrVAWsowgz9bva8) and the other at [Pier 39](https://maps.app.goo.gl/BeQMBzJqJouU4FF69). I heard those two places are usually packed like sardines on Independence Day, so I opted for a panoramic view from afar. Corona Heights is a gem because its view covers not just those two regions, but also all the secondary private firework shows put up by the locals. If you go up [Twin Peaks](https://maps.app.goo.gl/PTkLwYdsAus2N8Ug6) and look in the direction of the two barges, Corona Heights will most likely block your view. In Singapore you can't set off your own pyrotechnics, so this was very cool to watch, but bear in the mind that the noise can continue till 4am and can sound eerily close to gunshots so I wouldn't recommend staying out too late. Also, there was [a police rush near 24th + Mission that night](https://www.youtube.com/watch?v=ved_oq6FQS0).

Now, onto my biggest takeaways.

**(1) The 3 most important skills for working in a technical role are: technical depth, curiosity, and being sociable/a team player.**
- Technical depth:
	- For industry roles, this can mean a deep understanding of how systems should work. This informs algorithmic and infrastructure design. It can also mean knowledge of how the industry operates, which informs business decisions. If you find that you don't possess enough of such knowledge, well, the only way to solve that problem is to experiment, log your experiences, reflect, and iterate. I really like [Jason Wei's "life is like SFT, then RL" analogy](https://www.jasonwei.net/blog/life-lessons-from-reinforcement-learning).
	- For research, this means knowing the research conversation surrounding a particular topic and being aware of the few key questions that most studies in your field revolve around. 
	- Solid fundamentals are only going to become more important. I anticipate that a lot of future work will involve verification of AI outputs, thus people need to know how things should be done in order to prevent their AI agents from outputting brittle solutions. 
	- Furthermore, I've noticed that many individuals who have managed to go very deep into subjects in a short span of time are **needs-based learners**. They pick the areas they want to learn about, find what's relevant/what the subtopics are, attack them with high agency, and just keep on recursing.
- Curiosity:
	- Without this, it's hard to ask the questions that can advance the frontier of a body of knowledge. While satisfying this curiosity, it is important to [be honest with yourself regarding whether you truly understand something or not](https://nabeelqu.substack.com/p/understanding). If you don't, then keep asking questions till you do and can teach the subject in simple terms. 
	- When I was 13, my secondary school music teacher told my class that in Hebrew, "learn=teach" because the words looked really similar. That quote has stuck with me ever since. The only things I feel I've truly learnt are those I can comfortably teach to beginners.
- Being a team player.
	- Ideas sharpen ideas. It is much nicer to have others to discuss hard problems with, and that's why I've seen quite a bit of advice saying that it is beneficial to have a cofounder to split the mental load of building a startup. This cofounder should be someone whom you can see yourself joking with & spending time with outside of work. Such a relationship is only going to last if you're personable.
	- With AI being a force multiplier, teams are going to become much leaner and this places more emphasis on being a nice person so your small team can be close-knit & thrive.
	- Ultimately, humans were designed by nature to be social creatures. Having positive social relationships is beneficial for personal well-being and career development. What goes around, comes around.

**(2) It is important to be high-agency, aka a "do-er".**
- It is very easy to *say* that one wants to achieve great things, *do*ing it is harder. I have been guilty of this as well. E.g. I have procrastinated on commitments by telling myself that I am currently busy with other things, but bear in mind that [procrastination disguised as work is one of the most dangerous forms of procrastination](https://www.paulgraham.com/greatwork.html). If you have an idea, waste no time in testing it out because the barrier to building a quick MVP is extremely low with AI assistance. Deploy iteratively and the other refinements in efficiency, infra, UX can come later. If you don't have ideas yet, then experience as many things as possible + diversify your info sources. Then the ideas will naturally come, as the best ideas tend to originate from firsthand experience with a problem.
- This point about being proactive applies to meeting new people as well. In talent-dense places like SF, it is common to bump into great individuals by chance. I had multiple serendipitous encounters at Caltrain and Muni stations. However, I was also intentional about meeting specific people, and being 'daring' enough to initiate contact has paid off. Thus, while you focus on improving yourself with fervent desire, I also recommend you find the talented individuals in your domain of interest. Get to know them and be inspired by their stories. Don't just bury your head in your work and stay on the conveyor belt. There are many alternate pathways to building a career and there might be much more activity / many more opportunities in your surroundings than you think.

**(3) In nearly all AI products there are pipelines that transform data into useful output. In my case, it was videos in, search queries in, search results out. At every point in the data flow, you'd want to design a basket of evals to build a comprehensive picture of system performance.** 
- You should continuously reason about whether the metrics make sense, and about how metrics at different points of the pipeline affect each other. For example, you might ask: "if the performance of a certain upstream component were perfect, what would the downstream results be?" If a result is unexpected / a component is significantly worse than others, you know where to focus your attention in the next iteration.
- You should also periodically question your metrics to determine if they align with how users would judge system performance in the wild. So, within the basket of evals at each point in the pipeline, some metrics will be stricter than others.

**(4) Be well and lead a balanced life so as not to burn out.**
This means:
- Have things to do outside work.
- Sleep well. 
- Eat well. 
- Have positive social relationships & good mentors.
- Get enough exercise and sunlight.
- Rid yourself of destructive habits/crutches that you use to medicate other problems.

On my social media feeds, it is common to read about the glorification of 18h work days and hustle culture. While I respect the grind, and agree there will be days where such effort is required to move the needle quickly, I feel it is not sustainable & will yield diminishing marginal returns. It is crucial to destress by engaging in hobbies and trying new things. After all, having more experiences can give you more ideas. So, slow down to speed up / live a day to fight another (this saying was introduced to me by my company sergeant major in basic military training.) Motivation can wax and wane, but being disciplined about maintaining this balance in life is key to preserving mental well-being and staying on track to make an impact in whatever field you care about.

I couldn't have learned the lessons above if not for the kind souls who taught them to me during my time in SF, so I am paying it forward and I hope they help you in some way :)