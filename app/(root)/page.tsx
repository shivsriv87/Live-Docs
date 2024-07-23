import Header from '@/components/Header'
import AddDocumentBtn from '@/components/AddDocumentBtn';
import { Button } from '@/components/ui/button'
import { dateConverter } from '@/lib/utils';
import { SignedIn, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const Home = async () => {
  const documents = [];
  const clerkUser = await currentUser();
  if(!clerkUser) redirect('/sign-in');


  return (
    <main className="home-container">
      <Header className='left-0 right-0 sticky'>
        <div className='flex items-center gap-2 lg:gap-4'>
          Notification
          <SignedIn>
            <UserButton/>
          </SignedIn>

        </div>

      </Header>
      {documents.length > 0 ? (
        <div>

        </div>
      ) :(
        <div className='document-list-empty'>
          < Image
           src = "/assets/icons/doc.svg"
           alt='document'
           width={40}
           height={40}
           className='mx-auto'/> 
           <AddDocumentBtn
           userId = {clerkUser.id}
           email = {clerkUser.emailAddresses[0].emailAddress}/>

        </div>
      )}
    </main>
  )
}

export default Home