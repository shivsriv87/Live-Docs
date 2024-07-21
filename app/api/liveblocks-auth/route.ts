// import { liveblocks } from "@/lib/liveblocks";
// import { getUserColor } from "@/lib/utils";
// import { currentUser } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";



// export async function POST(request: Request) {
//   const clerkUser = await currentUser();
//   const { id,firstName,lastName,emailAddresses,imageUrl } = clerkUser;


//   if(!clerkUser) redirect ('/sign-in');
//   const user ={
//     id,
//     info : {
//       id,
//       name : `${firstName} ${lastName}`,
//       email: emailAddresses[0].emailAddress ,
//       avatar: imageUrl,
//       color : getUserColor(id);
//     }
//   }

//   // Identify the user and return the result
//   const { status, body } = await liveblocks.identifyUser(
//     {
//       userId: user.id,
//       groupIds, // Optional
//     },
//     { userInfo: user.metadata },
//   );

//   return new Response(body, { status });
// }
import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect('/sign-in');
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  const user = {
    id,
    info: {
      id,
      name: `${firstName} ${lastName}`,
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    }
  }

  // Identify the user and return the result
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: user.info.email,
      groupIds: [] , // Optional, you can define this based on your requirements
    },
    { userInfo: user.info },
  );

  return new Response(body, { status });
}
