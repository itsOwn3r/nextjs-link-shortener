import { NextRequest, NextResponse } from "next/server";
import { escape } from "querystring";
import mysql, { RowDataPacket } from "mysql2/promise";

export async function POST(req: NextRequest) {
  const data = await req.json();
  if (!data.url) {
    return NextResponse.json({sucess: false, warning: "Something Is Wrong.", warningDescription: "Url Not Provided."}, {status: 400}) 
  }
  const escapedUrl = escape(data.url);
  const connection = await mysql.createConnection({
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    port: Number(process.env.DBPort),
    database: process.env.Database,
  });

  const query = `Select * from links WHERE shorturl LIKE "${escape(escapedUrl)}"`;
  const [rows] = await connection.execute<RowDataPacket[]>(query);
  if (rows.length === 0 || rows.length === undefined) {
      return NextResponse.json({available: true});
  }else{
    return NextResponse.json({available: false});
  }
}
