
import { NextResponse } from 'next/server';
export  async function POST(request) {
  const Links =[];
const data = await request.json();
const link = data.url;
Links.push(link);
return NextResponse.json({Links});
}
export const config = {
    api: {
      bodyParser: false,
    },
  }