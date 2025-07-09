import style from './index.module.css';

export default function SectionTitle({
  tabs,
  children,
  className,
  activeTab,
  changeTabHandler,
}: {
  tabs?: Array<{ label: string; value: string }>;
  children: string;
  className?: string;
  activeTab?: string;
  changeTabHandler?: (label: string) => void;
}) {
  return (
    <div
      className={`${style['title']} ${
        className || ''
      } max-lg:flex max-lg:flex-col w-full gap-4`}
    >
      <h2 className='flex flex-col text-center max-lg:items-center leading-snug'>
        {children}
      </h2>

      {tabs && tabs.length > 0 && (
        <div className='max-lg:overflow-scroll max-lg:w-full md:flex md:max-lg:justify-center'>
          <ul className='max-lg:mt-4 flex-nowrap w-max'>
            {tabs.map((tab, i) => (
              <li key={i}>
                <button
                  className={`${
                    activeTab === tab.value ? style['active'] : ''
                  } w-max`}
                  onClick={() =>
                    changeTabHandler && changeTabHandler(tab.value)
                  }
                >
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
