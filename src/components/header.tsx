import { Github, GithubIcon, LinkedinIcon, RssIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileImage from './15058771.jpeg';

export function Header() {
  return (
    <div className="mx-auto flex w-full max-w-[800px] items-center justify-between gap-4 px-4 py-10 text-xl">
      <Link href="/" className="flex items-center gap-4">
        <Image
          src={ProfileImage}
          alt="Picture of the author"
          className="size-12 rounded-full"
          placeholder="blur"
        />
        <h1 className="text-3xl font-bold text-white">oazevedo.dev</h1>
      </Link>
      <div className="flex items-center gap-4 text-white">
        <Link href="#">Sobre</Link>
        <Link href="#">
          <RssIcon />
        </Link>
      </div>
    </div>
  );
}
