import React from 'react';
import { AnimatedGradientText } from '../magicui/animated-gradient-text';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Link from 'next/link';
import { Button } from '../ui/button';
import { Marquee } from '../magicui/marquee';
import img1 from '@/public/hero-images/Charismatic Young Man with a Warm Smile and Stylish Tousled Hair.jpeg';
import img2 from '@/public/hero-images/Confident Businesswoman on Turquoise Backdrop.jpeg';
import img3 from '@/public/hero-images/Confident Woman in Red Outfit.jpeg';
import img4 from '@/public/hero-images/Confident Woman in Urban Setting.jpeg';
import img5 from '@/public/hero-images/Futuristic Helmet Portrait.jpeg';
import img6 from '@/public/hero-images/Futuristic Woman in Armor.jpeg';
import img7 from '@/public/hero-images/Man in Brown Suit.jpeg';
import img8 from '@/public/hero-images/Poised Elegance of a Young Professional.jpeg';
import img9 from '@/public/hero-images/Professional Business Portrait.jpeg';
import img10 from '@/public/hero-images/Professional Woman in Navy Blue Suit.jpeg';
import img11 from '@/public/hero-images/Sophisticated Businessman Portrait.jpeg';
import Image from 'next/image';

const avatars = [
  {
    src: '/avatars/AutumnTechFocus.jpeg',
    fallback: 'CN',
  },
  {
    src: '/avatars/Casual Creative Professional.jpeg',
    fallback: 'AB',
  },
  {
    src: '/avatars/Golden Hour Contemplation.jpeg',
    fallback: 'FG',
  },
  {
    src: '/avatars/Portrait of a Woman in Rust-Colored Top.jpeg',
    fallback: 'PW',
  },
  {
    src: '/avatars/Radiant Comfort.jpeg',
    fallback: 'RC',
  },
  {
    src: '/avatars/Relaxed Bearded Man with Tattoo at Cozy Cafe.jpeg',
    fallback: 'RB',
  },
];

const Images = [
  {
    src: img1,
    alt: 'AI generated image',
  },
  {
    src: img2,
    alt: 'AI generated image',
  },
  {
    src: img3,
    alt: 'AI generated image',
  },
  {
    src: img4,
    alt: 'AI generated image',
  },
  {
    src: img5,
    alt: 'AI generated image',
  },
  {
    src: img6,
    alt: 'AI generated image',
  },
  {
    src: img7,
    alt: 'AI generated image',
  },
  {
    src: img8,
    alt: 'AI generated image',
  },
  {
    src: img9,
    alt: 'AI generated image',
  },
  {
    src: img10,
    alt: 'AI generated image',
  },
  {
    src: img11,
    alt: 'AI generated image',
  },
];

const MarqueeColumn = ({
  reverse,
  duration,
  className,
}: {
  reverse: boolean;
  duration: string;
  className?: string;
}) => {
  return (
    <Marquee
      reverse={reverse}
      pauseOnHover
      vertical
      className={cn(
        'w-full relative h-full flex flex-col justify-center items-center',
        className
      )}
      style={
        {
          '--duration': duration,
        } as React.CSSProperties
      }
    >
      {Images.sort(() => Math.random() - 0.5).map((image, index) => {
        return (
          <Image
            key={index}
            src={image.src}
            alt={image.alt}
            priority
            className='w-full h-full object-cover rounded opacity-[0.25] hover:opacity-100 transition-opacity duration-300 ease-in-out z-2'
          />
        );
      })}
    </Marquee>
  );
};

const HeroSection = () => {
  return (
    <section className='w-full relative overflow-hidden min-h-screen flex flex-col items-center justify-center'>
      <div className='space-y-4 text-center z-40 backdrop-blur-[2px]'>
        <div className='group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f] '>
          <span
            className={cn(
              'absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]'
            )}
            style={{
              WebkitMask:
                'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'destination-out',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'subtract',
              WebkitClipPath: 'padding-box',
            }}
          />
          🎉 <hr className='mx-2 h-4 w-px shrink-0 bg-neutral-500' />
          <AnimatedGradientText className='text-sm font-medium z-20'>
            Try new flux model
          </AnimatedGradientText>
          <ChevronRight className='ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5' />
        </div>
      </div>
      <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter pt-4 z-20 text-center px-6'>
        Transform your photos with the power of AI
      </h1>
      <p className='mx-auto max-w-3xl text-sm xs:text-base sm:text-lg md:text-xl mb-5 text-center text-gray-600 pt-4 z-20 px-6'>
        From LinkedIn headshots to Instagram influencer photos, Pictoria
        AI&apos;s state-of-the-art technology ensures you always look your best.
        Create, edit, and generate images effortlessly.
      </p>
      <div className='flex items-center space-x-2 mb-4'>
        <div className='flex items-center -space-x-5 sm:-space-x-4 overflow-hidden'>
          {avatars.map((avatar, index) => {
            return (
              <Avatar
                key={index}
                className='inline-block border-2 border-background z-20'
              >
                <AvatarImage src={avatar.src} className='h-full object-cover' />
                <AvatarFallback>{avatar.fallback}</AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className='text-sm font-medium z-20'>Loved by 1k+ customers</span>
      </div>
      <Link href='/login?state=signup' className='z-20'>
        <Button className='rounded-md text-base h-12'>
          ✨ Create Your First AI Model ✨
        </Button>
      </Link>
      <div className='absolute top-0 w-full grid grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 z-10'>
        <MarqueeColumn reverse={false} duration='120s' />
        <MarqueeColumn reverse={true} duration='120s' />
        <MarqueeColumn reverse={false} duration='120s' />
        <MarqueeColumn
          reverse={true}
          duration='120s'
          className='hidden md:flex'
        />
        <MarqueeColumn
          reverse={false}
          duration='120s'
          className='hidden lg:flex'
        />
        <MarqueeColumn reverse={true} duration='120s' />
      </div>
    </section>
  );
};

export default HeroSection;
