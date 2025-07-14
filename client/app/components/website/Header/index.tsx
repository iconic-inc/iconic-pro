import style from './index.module.css';
import HeaderSideBar from './SidebarHeader';
import { Button } from '~/components/ui/button';
import { Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';
import { Form } from '@remix-run/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Check if we've scrolled past the header height
      if (currentScrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      {/* Spacer to prevent content jump when header becomes fixed */}
      {isScrolled && <div className='h-20' />}

      <motion.header
        className={`${style.header} px-4 flex justify-between items-center w-[430px] ${
          isScrolled ? 'fixed top-0 z-50' : 'relative'
        } bg-main`}
        key={isScrolled ? 'fixed' : 'relative'}
        initial={isScrolled ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        animate={{
          y: 0,
          opacity: 1,
          backgroundColor: isScrolled
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(255, 255, 255, 1)',
          backdropFilter: isScrolled ? 'blur(8px)' : 'blur(0px)',
          boxShadow: isScrolled
            ? '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
            : '0 0 0 0 rgba(0, 0, 0, 0)',
        }}
        exit={isScrolled ? { y: -100, opacity: 0 } : { y: 0, opacity: 1 }}
        transition={{
          duration: 0.1,
        }}
      >
        <HeaderSideBar />

        <div className='h-[70px]'>
          <img
            src='/images/logo.png'
            alt='Iconic PRO'
            className='object-contain object-center w-full'
          />
        </div>

        <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DialogTrigger asChild>
            <Button
              variant='ghost'
              className='w-10 h-10 rounded-full bg-sub1 active:bg-sub1 hover:bg-sub1 text-white'
            >
              <Search className='w-4 h-4' />
            </Button>
          </DialogTrigger>
          <DialogContent className='bg-transparent border-none text-white'>
            <div className='relative'>
              <Form
                action='/search'
                role='search'
                className='mt-6'
                onSubmit={() => setIsSearchOpen(false)}
              >
                <input
                  type='text'
                  className='w-full bg-transparent border-b-2 border-white/50 outline-0 px-2 text-white placeholder:text-white/70 text-xl focus:border-white transition-colors'
                  placeholder='Tìm kiếm'
                  aria-label='Search blogs'
                  name='q'
                  autoFocus
                />

                <div className='absolute right-0 bottom-0 flex justify-center gap-4'>
                  <Button type='submit' variant={'ghost'} className='py-4 px-4'>
                    <Search className='w-8 h-8' />
                  </Button>
                </div>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </motion.header>
    </>
  );
}
