const NEXT_IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMG_BB_API;

const uploadImage = async (image: File): Promise<string> => {
    if (!NEXT_IMGBB_API_KEY) {
        throw new Error("ImgBB API key is missing.");
    }

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${NEXT_IMGBB_API_KEY}`,
        {
            method: "POST",
            body: formData,
        }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Image upload failed.");
    }

    return data.data.display_url;
};

export default uploadImage;