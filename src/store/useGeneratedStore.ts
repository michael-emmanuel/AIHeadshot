import { generateImageAction, storeImages } from '@/app/actions/image-actions';
import { nullable } from 'zod';
import { create } from 'zustand';
import { z } from 'zod';
import { ImageGenerationFormSchema } from '@/components/image-generation/Configurations';
import { toast } from 'sonner';

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

    const toastId = toast.loading('Generating image...');

    try {
      const { error, success, data } = await generateImageAction(values);
      if (!success) {
        set({ error: error, loading: false });
        return;
      }

      // return the url of the image along with all the input values(guidance, # of inf steps, prompt, etc..)
      const dataWithUrl = data.map((url: string) => {
        return {
          url,
          ...values,
        };
      });

      set({ images: dataWithUrl, loading: false });
      toast.success('Image generated successfully', { id: toastId });

      await storeImages(dataWithUrl);
      toast.success('Image stored successfully', { id: toastId });
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
