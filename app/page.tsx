"use client";

import { useState } from "react";

export default function Home() {
  const [relation, setRelation] = useState<string[]>([]);
  const [background, setBackground] = useState<string[]>([]);
  const [plot, setPlot] = useState<string[]>([]);
  const [viewpoint, setViewpoint] = useState("");
  const [specialForm, setSpecialForm] = useState("");
  const [styleRef, setStyleRef] = useState("");
  const [styleText, setStyleText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const toggle = (
    arr: string[],
    value: string,
    setter: (v: string[]) => void
  ) => {
    setter(
      arr.includes(value)
        ? arr.filter((i) => i !== value)
        : [...arr, value]
    );
  };

  const generate = async () => {
    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          relation,
          background,
          plot,
          viewpoint,
          specialForm,
          styleRef,
          styleText,
        }),
      });

      // ❗ 非 200 直接读取 text，防止 JSON 炸掉
      if (!res.ok) {
        const errorText = await res.text();
        alert("生成失败：\n" + errorText);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (!data.text) {
        alert("生成失败：未返回文本");
        setLoading(false);
        return;
      }

      setResult(data.text);
    } catch (err) {
      console.error(err);
      alert("请求异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h2>陈楚生 × 王栎鑫 同人生成器</h2>

      <h4>人物关系（多选）</h4>
      {[
        "父子",
        "师生",
        "骨科",
        "乐队吉他手&男高",
        "dom&sub",
        "明星&网黄",
        "三角关系",
      ].map((v) => (
        <label key={v} style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            onChange={() => toggle(relation, v, setRelation)}
          />{" "}
          {v}
        </label>
      ))}

      <h4>背景设定（多选）</h4>
      {["现实背景", "古风", "民国", "乡土", "出租屋"].map((v) => (
        <label key={v} style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            onChange={() => toggle(background, v, setBackground)}
          />{" "}
          {v}
        </label>
      ))}

      <h4>关键情节（多选）</h4>
      {[
        "Phone sex",
        "Public sex",
        "强制高潮",
        "回家过年",
        "调教",
        "一夜情",
        "私奔",
        "0713众人喝酒唱歌",
      ].map((v) => (
        <label key={v} style={{ marginRight: 12 }}>
          <input
            type="checkbox"
            onChange={() => toggle(plot, v, setPlot)}
          />{" "}
          {v}
        </label>
      ))}

      <h4>人物视角</h4>
      {[
        "陈楚生第一人称",
        "王栎鑫第一人称",
        "双方第三人称",
        "第三者第一视角",
      ].map((v) => (
        <label key={v} style={{ display: "block" }}>
          <input
            type="radio"
            name="viewpoint"
            onChange={() => setViewpoint(v)}
          />{" "}
          {v}
        </label>
      ))}
      <input
        placeholder="或自定义视角（选填）"
        value={viewpoint}
        onChange={(e) => setViewpoint(e.target.value)}
        style={{ width: "100%", marginTop: 8 }}
      />

      <h4>特殊设定</h4>
      {["纯对话", "日记体", "论坛体", "多段式超短篇"].map((v) => (
        <label key={v} style={{ marginRight: 12 }}>
          <input
            type="radio"
            name="special"
            onChange={() => setSpecialForm(v)}
          />{" "}
          {v}
        </label>
      ))}

      <h4>参考作品风格</h4>
      {[
        "安德烈·艾席蒙《Call Me by Your Name》",
        "王小波《爱你就像爱生命》",
        "马尔克斯《百年孤独》",
        "特德·姜《你一生的故事》",
        "双雪涛《平原上的摩西》",
        "侯孝贤电影节奏",
        "纪实散文风",
      ].map((v) => (
        <label key={v} style={{ display: "block" }}>
          <input
            type="radio"
            name="style"
            onChange={() => setStyleRef(v)}
          />{" "}
          {v}
        </label>
      ))}

      <textarea
        rows={4}
        placeholder="或粘贴一段参考文本（选填）"
        value={styleText}
        onChange={(e) => setStyleText(e.target.value)}
        style={{ width: "100%", marginTop: 8 }}
      />

      <button
        onClick={generate}
        disabled={loading}
        style={{ marginTop: 16 }}
      >
        {loading ? "生成中…" : "Generate"}
      </button>

      {result && (
        <pre
          style={{
            whiteSpace: "pre-wrap",
            marginTop: 24,
            lineHeight: 1.7,
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}
