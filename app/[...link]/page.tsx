import { escape, unescape } from "querystring";
import { notFound, redirect } from "next/navigation";
import mysql, { RowDataPacket } from "mysql2/promise";
const Page = async ({ params }: { params: { link: string } }) => {
  const connection = await mysql.createConnection({
    host: process.env.Host,
    user: process.env.User,
    password: process.env.Password,
    port: Number(process.env.DBPort),
    database: process.env.Database,
  });
  const view = `UPDATE links SET view=view+1 WHERE shorturl LIKE "${escape(params.link)}"`;
  const query = `Select * from links WHERE shorturl LIKE "${escape(params.link)}"`;
  const [rows] = await connection.execute<RowDataPacket[]>(query);
  if (rows.length === 0 || rows.length === undefined) {
      return notFound();
    }
  const [view_increase] = await connection.execute<RowDataPacket[]>(view);
  redirect(unescape(rows[0]["url"]));
  return null;
};

export default Page;
