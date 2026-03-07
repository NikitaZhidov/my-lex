import { TermLookup } from '@/features/terms/lookup/components';
import AppGreeting from '@/shared/components/AppGreeting';

export default function MainPage() {
  return (
    <div className='flex flex-auto'>
      <div className='max-w-4xl lg:w-4xl md:min-w-md sm:mx-auto w-full px-4 pt-4'>
        <div className='flex w-full'>
          <TermLookup
            className='transition-[margin] pb-4'
            hasTermClassname='mt-[2vh]'
            noTermClassname='mt-[25vh]'
          >
            <AppGreeting className='sm:mb-8 mb-6' />
          </TermLookup>
        </div>
      </div>
    </div>
  );
}
