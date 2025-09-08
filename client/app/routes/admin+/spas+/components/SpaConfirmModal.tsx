import { useFetcher } from '@remix-run/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ISpa } from '~/interfaces/spa.interface';

export default function SpaConfirmModal({
  setShowDeleteModal,
  selectedSpas,
  setSelectedSpas,
}: {
  setShowDeleteModal: (show: boolean) => void;
  selectedSpas: ISpa[];
  setSelectedSpas: (spas: ISpa[]) => void;
}) {
  const bulkDeleteFetcher = useFetcher();
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (bulkDeleteFetcher.data) {
      setShowDeleteModal(false);
      const response = bulkDeleteFetcher.data as {
        success: boolean;
        message: string;
        error?: string;
      };
      if (response.success) {
        toast.success(`Đã xóa ${selectedSpas.length} spa thành công!`);
        setSelectedSpas([]);
        // Refresh dữ liệu
        window.location.reload();
      } else {
        toast.error(response.error || 'Có lỗi xảy ra khi xóa spa.');
      }
      setIsDeleting(false);
    }
  }, [bulkDeleteFetcher.data]);

  const handleDelete = () => {
    setIsDeleting(true);
    const spaIds = selectedSpas.map((spa) => spa.id);
    bulkDeleteFetcher.submit(
      { spaIds: JSON.stringify(spaIds) },
      { method: 'DELETE' },
    );
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <bulkDeleteFetcher.Form
        method='DELETE'
        className='bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto'
      >
        <h3 className='text-lg font-bold mb-4'>Xác nhận xóa</h3>
        <p className='mb-6'>
          {selectedSpas.length > 1
            ? `Bạn có chắc chắn muốn xóa ${selectedSpas.length} spa?`
            : `Bạn có chắc chắn muốn xóa spa này?`}
          Thao tác này không thể khôi phục.
        </p>

        <div className='flex justify-end gap-2'>
          <button
            className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md transition'
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
            type='button'
          >
            Hủy
          </button>

          <button
            className='px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md transition flex items-center gap-2'
            type='submit'
            onClick={() => handleDelete()}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <svg
                  className='animate-spin -ml-1 mr-2 h-4 w-4 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  ></path>
                </svg>
                Đang xóa...
              </>
            ) : (
              'Xóa'
            )}
          </button>
        </div>
      </bulkDeleteFetcher.Form>
    </div>
  );
}
