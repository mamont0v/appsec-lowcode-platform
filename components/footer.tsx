import Image from "next/image";
// import logoImage from '@/assets/logosaas.png';
// import SocialX from '@/assets/social-x.svg';
// import SocialInsta from '@/assets/social-insta.svg';



const Footer = async () => {
  return (
    <footer className="mx-auto w-full max-w-4xl bg-black text-[#BCBCBCBC] text-sm py-10 text-center">
      <div className="container">
        <div className="inline-flex relative before:content-[''] before:h-full before:w-full before:top-0 before:bottom-0 before:blur  before:bg-[linear-gradient(to_right,#F87BFF,#FB92CF,#FFDD9B,#C2F0B1,#2FD8FE)] before:absolute">
          {/* <Image src={logoImage} alt="Logo" height={40} className='relative' /> */}
        </div>
        <nav className='flex flex-col md:flex-row md:justify-center gap-6 mt-6'>
          <a href='#'>О нас</a>
          <a href='#'>Клиенты</a>
          <a href='#'>Цена</a>
          <a href='#'>Помощь</a>
        </nav>
        <div className="flex justify-center gap-6 mt-6">
          {/* <SocialX />
          <SocialInsta /> */}
        </div>
        <p className='mt-6'>&copy; 2024 ИП "Иванов Иван Иваночи", Кибер Квест. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;