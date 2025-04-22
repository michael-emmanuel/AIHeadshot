import { generateImageAction } from '@/app/actions/image-actions';
import { nullable } from 'zod';
import { create } from 'zustand';
import { z } from 'zod';
import { ImageGenerationFormSchema } from '@/components/image-generation/Configurations';

interface GenerateState {
  loading: boolean;
  images: Array<{ url: string }>;
  error: string | null;
  generateImage: (
    values: z.infer<typeof ImageGenerationFormSchema>
  ) => Promise<void>;
}

// create function from zustand creates a global state(like redux), give us access to set which allows us to set the state
// Benefits of zustand, can use the hook anywhere without the need of provider
const useGeneratedStore = create<GenerateState>(set => ({
  loading: false,
  images: [],
  error: null,

  generateImage: async (values: z.infer<typeof ImageGenerationFormSchema>) => {
    set({ loading: true, error: null });

    try {
      const { error, success, data } = await generateImageAction(values);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      const dataWithUrl = data.map((url: string) => {
        return {
          url,
        };
      });

      set({ images: dataWithUrl, loading: false });
    } catch (error) {
      console.log(error);
      set({
        error: 'Failed to generate image, please try again',
        loading: false,
      });
    }
  },
}));

export default useGeneratedStore;
