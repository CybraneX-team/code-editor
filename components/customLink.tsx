import { setName } from '@/lib/slices/projectname';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
// import { useDispatch } from 'react-redux';

export default function CustomLink({ name,children }: {name: string, children: ReactNode}) {
    // const dispatch = useDispatch();
    const router = useRouter();
  const handleClick = (e: any) => {
    e.preventDefault();
    // dispatch(setName(name));
    router.push("/editor")
  };

  return (
    <Link href={"/editor"} passHref legacyBehavior>
      <a onClick={handleClick}>
        {children}
      </a>
    </Link>
  );
}