import { NextRequest, NextResponse } from "next/server";
import { escape } from "querystring";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.url) {
  return NextResponse.json({sucess: false, warning: "Something Is Wrong.", warningDescription: "Url Not Provided."}, {status: 400}) 
  }
  const escapedUrl = escape(data.url);
  const escapedCustom = escape(data.custom);
  const connection = await mysql.createConnection({
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    port: Number(process.env.DBPort),
    database: process.env.Database,
  });

  const uniqeId: () => Promise<string> = async () => {
    let firstNumber = Math.ceil(Math.random() * 5);
    if (firstNumber < 4) {
      firstNumber = 4; // minimum charachter
    }
    let createUniqeId = Math.random().toString(36).replace(/[^a-z0-9]/gi, "").slice(1, firstNumber);
    const query = `Select * from links WHERE shorturl="${escape(
      createUniqeId
    )}"`;
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    if (rows.length === 0 || rows.length === undefined) {
      return createUniqeId;
    } else {
      createUniqeId = Math.random().toString(36).replace(/[^a-z0-9]/gi, "").slice(1, firstNumber);
      return await uniqeId();
    }
  };

  const response: {warning?: string, warningDescription?: string, shorturl?: string, success?: true } = {}
  let shortedUrl;
  if (data.custom === null || data.custom === "") {
    shortedUrl = await uniqeId();
  }else{
    const query = `Select * from links WHERE shorturl="${escape(escapedCustom)}"`;
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    if (rows.length === 0 || rows.length === undefined) {
      shortedUrl = escapedCustom
    }else{
      response.warning = "The Custom URL that you provided, was already taken!"
      response.warningDescription = "How did that happend?"
      shortedUrl = await uniqeId();
    }
  }
  const query = `INSERT INTO links(url, shorturl) VALUES ('${escapedUrl}','${shortedUrl}')`;
  const values: never[] = [];
  const [rows] = await connection.execute<RowDataPacket[]>(query);

  const queryForResult = `Select * from links WHERE shorturl="${shortedUrl}"`;
  const [rowsOfQueryForResult] = await connection.execute<RowDataPacket[]>(queryForResult, values);
  response.shorturl = rowsOfQueryForResult[0].shorturl
  response.success = true;
  return NextResponse.json(response);
}
