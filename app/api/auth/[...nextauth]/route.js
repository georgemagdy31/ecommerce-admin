
import clientPromise from '@/lib/mongodb'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import NextAuth, { getServerSession } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const adminEmails = ['georgemagdy718@gmail.com']

const handler = NextAuth({
  providers: [

    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
 
  ],
  adapter: MongoDBAdapter(clientPromise),
  callbacks:{
session:({session,token,user})=>{
 if(adminEmails.includes(session?.user?.email)){
  return session;
 } else{
  return session;
 }

}
  },
})
export { handler as GET, handler as POST}

export async function isAdminRequest(req,res){
const session = await getServerSession(req,res,handler);
if(!adminEmails.includes(session?.user?.email)){
  throw 'not an admin';
}
}

