import { Menu } from 'lucide-react';
import { useState } from 'react';
import Defer from '~/components/Defer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { Button } from '~/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '~/components/ui/sheet';
import { useMainLoaderData } from '~/lib/useMainLoaderData';

export default function HeaderSideBar() {
  const { categories } = useMainLoaderData();
  const [isOpen, setIsOpen] = useState(false);

  const closeSheet = () => setIsOpen(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant='ghost'
          size='icon'
          className='bg-sub1 rounded-full h-10 w-10'
        >
          <Menu className='h-6 w-6 text-white' />
        </Button>
      </SheetTrigger>
      <SheetContent className='overflow-y-auto bg-main border-none' side='left'>
        <div className='flex flex-col gap-6'>
          <Accordion
            type='single'
            collapsible
            className='flex w-full flex-col gap-4 text-white'
          >
            <Defer resolve={categories}>
              {(cats) =>
                cats.map((cat) =>
                  renderMobileMenuItem(
                    { title: cat.cat_name, url: cat.cat_url },
                    closeSheet,
                  ),
                )
              }
            </Defer>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}

const renderMobileMenuItem = (item: any, closeSheet: () => void) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className='text-white'>
        <AccordionTrigger className='text-md font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className=''>
          {item.items.map((subItem: any) => (
            <SubMenuLink
              key={subItem.title}
              item={subItem}
              onNavigate={closeSheet}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <a
      key={item.title}
      href={item.url}
      className='text-md font-semibold'
      onClick={closeSheet}
    >
      {item.title}
    </a>
  );
};

const SubMenuLink = ({
  item,
  onNavigate,
}: {
  item: any;
  onNavigate: () => void;
}) => {
  return (
    <a
      className='flex flex-row gap-4 rounded-md p-3 leading-none no-underline transition-colors outline-none select-none hover:bg-muted hover:text-accent-foreground'
      href={item.url}
      onClick={onNavigate}
    >
      <div className='text-foreground'>{item.icon}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-sm leading-snug text-muted-foreground'>
            {item.description}
          </p>
        )}
      </div>
    </a>
  );
};

// This is sample data.
const data = {
  navMain: [
    {
      title: 'Getting Started',
      url: '#',
      items: [
        {
          title: 'Installation',
          url: '#',
        },
        {
          title: 'Project Structure',
          url: '#',
        },
      ],
    },
    {
      title: 'Building Your Application',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#',
        },
        {
          title: 'Data Fetching',
          url: '#',
          isActive: true,
        },
        {
          title: 'Rendering',
          url: '#',
        },
      ],
    },
    {
      title: 'Building Your Applicatio',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#',
        },
        {
          title: 'Data Fetching',
          url: '#',
          isActive: true,
        },
        {
          title: 'Rendering',
          url: '#',
        },
      ],
    },
    {
      title: 'Building Your Applicatio',
      url: '#',
      items: [
        {
          title: 'Routing',
          url: '#',
        },
        {
          title: 'Data Fetching',
          url: '#',
          isActive: true,
        },
        {
          title: 'Rendering',
          url: '#',
        },
      ],
    },
  ],
};
