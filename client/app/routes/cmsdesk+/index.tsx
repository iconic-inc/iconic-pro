import { toast as notify } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { data, useFetcher, useLoaderData } from '@remix-run/react';

import TextInput from '~/components/TextInput';
import ImageInput from '~/components/ImageInput';
import HandsomeError from '~/components/HandsomeError';
import TextAreaInput from '~/components/TextAreaInput';
import { parseAuthCookie } from '~/services/cookie.server';
import { getAppSettings } from '~/services/app.server';
import { LoaderFunctionArgs } from '@remix-run/node';
import { IImage } from '~/interfaces/image.interface';
import { Card } from '~/components/ui/card';

export const meta = () => [
  {
    title: 'Cài đặt trang',
  },
];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const session = await parseAuthCookie(request);
  if (!session) {
    throw new Response('Unauthorized', { status: 401 });
  }

  // Fetch unseen bookings count
  const appSettings = await getAppSettings();

  return { appSettings };
};

export default function CmsDesk() {
  const { appSettings } = useLoaderData<typeof loader>();

  const fetcher = useFetcher<any>();

  const [logo, setLogo] = useState<IImage>(
    appSettings.app_logo || ({} as IImage),
  );
  const [title, setTitle] = useState(appSettings.app_title);
  const [description, setDescription] = useState(appSettings.app_description);
  // const [favicon, setFavicon] = useState(appSettings.app_favicon);
  const [facebook, setFacebook] = useState(appSettings.app_social.facebook);
  const [tiktok, setTiktok] = useState(appSettings.app_social.tiktok);
  const [youtube, setYoutube] = useState(appSettings.app_social.youtube);
  const [zalo, setZalo] = useState(appSettings.app_social.zalo);
  const [taxCode, setTaxCode] = useState(appSettings.app_taxCode);
  const [headScripts, setHeadScripts] = useState(appSettings.app_headScripts);
  const [bodyScripts, setBodyScripts] = useState(appSettings.app_bodyScripts);

  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    setIsChanged(
      title !== appSettings.app_title ||
        description !== appSettings.app_description ||
        facebook !== appSettings.app_social.facebook ||
        tiktok !== appSettings.app_social.tiktok ||
        youtube !== appSettings.app_social.youtube ||
        zalo !== appSettings.app_social.zalo ||
        taxCode !== appSettings.app_taxCode ||
        logo !== appSettings.app_logo ||
        // favicon !== appSettings.app_favicon ||
        headScripts !== appSettings.app_headScripts ||
        bodyScripts !== appSettings.app_bodyScripts,
      // favicon?.includes('blob'),
    );
  }, [
    logo,
    title,
    description,
    // favicon,
    facebook,
    tiktok,
    youtube,
    zalo,
    taxCode,
    headScripts,
    bodyScripts,
  ]);

  const toastIdRef = useRef<any>(null);

  useEffect(() => {
    switch (fetcher.state) {
      case 'submitting':
        toastIdRef.current = notify.loading('Loading...', {
          autoClose: false,
        });

        break;

      case 'idle':
        if (fetcher.data?.toast && toastIdRef.current) {
          const { toast: toastData } = fetcher.data as any;
          notify.update(toastIdRef.current, {
            render: toastData.message,
            type: toastData.type || 'success', // Default to 'success' if type is not provided
            autoClose: 3000,
            isLoading: false,
          });
          toastIdRef.current = null;
          setIsChanged(false);
          break;
        }

        notify.update(toastIdRef.current, {
          render: fetcher.data?.toast.message,
          autoClose: 3000,
          isLoading: false,
          type: 'error',
        });

        break;
    }
  }, [fetcher.state]);

  return (
    <div className=''>
      <h2 className='text-3xl font-extrabold text-gray-900 mb-8'>
        Beauty Map Dashboard
      </h2>

      <Card className='p-6 lg:p-8 shadow-2xl rounded-xl bg-white'>
        <fetcher.Form
          className='grid grid-cols-12 gap-8 col-span-12'
          method='POST'
          action='/cmsdesk'
          encType='multipart/form-data'
        >
          <div className='col-span-4 flex flex-col gap-4'>
            <ImageInput
              name='logo'
              label='Logo'
              value={logo || ({} as any)}
              onChange={(v) => setLogo(v as IImage)}
            />

            {/* <ImageInput
            name='favicon'
            label='Favicon'
            value={favicon}
            onChange={setFavicon}
          /> */}
          </div>

          <div className='meta col-span-4 flex flex-col gap-4'>
            <div className='meta flex flex-col gap-4'>
              <TextInput
                name='title'
                value={title}
                label='Tiêu đề trang'
                onChange={setTitle}
              />

              <TextInput
                name='description'
                value={description}
                label='Mô tả'
                onChange={setDescription}
              />

              <TextAreaInput
                name='headScripts'
                value={headScripts || ''}
                label='Head Scripts'
                onChange={setHeadScripts}
              />

              <TextAreaInput
                name='bodyScripts'
                value={bodyScripts || ''}
                label='Body Scripts'
                onChange={setBodyScripts}
              />
            </div>
          </div>

          <div className='logo col-span-4 flex flex-col gap-4'>
            <TextInput
              name='facebook'
              value={facebook}
              label='Facebook'
              onChange={setFacebook}
            />

            <TextInput
              name='tiktok'
              value={tiktok}
              label='Tiktok'
              onChange={setTiktok}
            />

            <TextInput
              name='youtube'
              value={youtube}
              label='Youtube'
              onChange={setYoutube}
            />

            <TextInput
              name='zalo'
              value={zalo}
              label='Zalo'
              onChange={setZalo}
            />

            <TextInput
              name='taxCode'
              value={taxCode}
              label='Mã số thuế'
              onChange={setTaxCode}
            />
          </div>

          <button
            className='middle col-span-8 col-start-5 none center w-full rounded-lg bg-blue-500 py-3 px-6 font-sans text-sm font-bold uppercase text-white shadow-md shadow-blue-500/20 transition-all hover:shadow-lg hover:shadow-blue-500/40 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none'
            data-ripple-light='true'
            type='submit'
            disabled={!isChanged}
          >
            Cập nhật
          </button>
        </fetcher.Form>
      </Card>
    </div>
  );
}

export const ErrorBoundary = () => <HandsomeError basePath='/cmsdesk' />;
