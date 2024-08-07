import Link from 'next/link';



export function LoginButton(props: { text: string; link: string; }) {
  return <Link href={props.link} className='
  block
  bg-white p-2 rounded-md me-2
  shadow-inner
  active:shadow-2xl'>{props.text}</Link>;
}
