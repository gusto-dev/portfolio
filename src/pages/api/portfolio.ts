// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuid4 } from "uuid";

interface Data {
  id: string;
  name: string;
  description: string;
  url: string;
  note?: string;
}
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data[]>
) {
  res.status(200).json([
    {
      id: uuid4(),
      name: "온에셋",
      description: "반응형",
      url: "https://www.onasset.co.kr/",
      note: "",
    },
    {
      id: uuid4(),
      name: "로엘법률사무소",
      description: "웹",
      url: "https://llcri.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "LPJ프라이빗상담",
      description: "반응형",
      url: "https://privatecounseling.co.kr/",
      note: "",
    },
    {
      id: uuid4(),
      name: "월드컵기념관",
      description: "반응형",
      url: "https://www.faentasium.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "생명보험사회공헌위원회",
      description: "반응형",
      url: "http://liscc.or.kr/",
      note: "",
    },
    {
      id: uuid4(),
      name: "젬백스앤카엘_바이오",
      description: "반응형",
      url: "http://www.gemvax.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "제니하우스",
      description: "반응형",
      url: "https://www.jennyhouse.co.kr/index.php",
      note: "",
    },
    {
      id: uuid4(),
      name: "유한화학",
      description: "반응형",
      url: "https://www.yuhanchem.co.kr/",
      note: "",
    },
    {
      id: uuid4(),
      name: "다우오피스",
      description: "반응형",
      url: "https://daouoffice.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "아이디 병원",
      description: "웹",
      url: "https://www.idhospital.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "아이디 병원",
      description: "모바일",
      url: "https://m.idhospital.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "저축은행중앙회",
      description: "반응형",
      url: "https://www.fsb.or.kr/index.act",
      note: "웹 접근성",
    },
    {
      id: uuid4(),
      name: "소비자포털",
      description: "반응형",
      url: "https://www.fsb.or.kr/cps_index.act",
      note: "웹 접근성",
    },
    {
      id: uuid4(),
      name: "SB톡톡플러스",
      description: "하이브리드 앱",
      url: "https://play.google.com/store/apps/details?id=kr.or.sbbank.plus&hl=ko&gl=US",
      note: "",
    },
    {
      id: uuid4(),
      name: "CGV MOS - 현장 운영 시스템",
      description: "하이브리드 앱",
      url: "",
      note: "",
    },
    {
      id: uuid4(),
      name: "헤럴드 기자단",
      description: "반응형",
      url: "https://heraldapply.com/",
      note: "",
    },
    {
      id: uuid4(),
      name: "프렌치마스터",
      description: "웹",
      url: "https://frenchmaster.co.kr/",
      note: "",
    },
    {
      id: uuid4(),
      name: "Deep Lol Pro",
      description: "반응형",
      url: "https://pro.deeplol.gg/",
      note: "",
    },
    {
      id: uuid4(),
      name: "Deep Lol Scrim",
      description: "반응형",
      url: "",
      note: "",
    },
    {
      id: uuid4(),
      name: "Deep LoL",
      description: "웹",
      url: "https://www.deeplol.gg/",
      note: "react",
    },
    {
      id: uuid4(),
      name: "Deep LoL",
      description: "모바일",
      url: "https://m.deeplol.gg/",
      note: "next.js",
    },
    {
      id: uuid4(),
      name: "고라니",
      description: "반응형",
      url: "https://www.gorani.kr/",
      note: "",
    },
    {
      id: uuid4(),
      name: "오케스트로 CMP",
      description: "일부 반응형",
      url: "내부 프로젝트",
      note: "vue.js",
    },
  ]);
}
