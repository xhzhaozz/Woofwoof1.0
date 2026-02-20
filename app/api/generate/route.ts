import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY!,
    });

    const body = await req.json();

    const CHARACTER_SETTING = `
【固定人物设定（不可更改）】

陈楚生：
- 年长一方
- 情绪内敛、克制
- 习惯承担、照顾他人
- 说话简洁，不情绪化，但有隐忍的温柔
- 在关系中偏向掌控节奏的一方

王栎鑫：
- 年轻一方
- 情绪外放、敏感
- 需要回应、确认、情感反馈
- 说话直接，偶尔试探、撒娇、挑衅
- 在关系中更主动表达欲望与不安

两人关系特点：
- 长期纠缠
- 不轻易说爱
- 情绪张力来自未说出口的部分
- 禁止幼态化、禁止脸谱化
`;

    const prompt = `
你正在创作一篇中文同人文本。

${CHARACTER_SETTING}

【本次创作条件】
人物关系：${(body.relation || []).join("、")}
背景设定：${(body.background || []).join("、")}
关键情节：${(body.plot || []).join("、")}
人物视角：${body.viewpoint || "不限"}
特殊设定：${body.specialForm || "无"}

【风格参考（模仿语言气质，不复刻情节）】
${body.styleRef || "无"}

【参考文本】
${body.styleText || "无"}

写作要求：
- 情绪真实
- 有张力
- 不露骨
- 避免OOC
- 字数约 600–900 字
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: "你是一名成熟的中文同人作者，语言自然，避免AI腔。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.85,
    });

    return NextResponse.json({
      text: completion.choices[0].message.content,
    });
  } catch (err: any) {
    console.error("❌ generate error:", err);

    return NextResponse.json(
      { error: "generate failed", detail: String(err) },
      { status: 500 }
    );
  }
}
