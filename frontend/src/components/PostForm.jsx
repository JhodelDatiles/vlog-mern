import { useState, useEffect } from "react";
import { uploadToCloudinary } from "../utils/cloudinary";
import { Loader2, Film, Image as ImageIcon } from "lucide-react";

const PostForm = ({ onSubmit, initialData, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialData?.mediaUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloadable, setIsDownloadable] = useState(initialData?.isDownloadable ?? true);

  const T_LIMIT = 100;
  const C_LIMIT = 1000;

  // Handle local preview generation
  useEffect(() => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.length > T_LIMIT || content.length > C_LIMIT) return;
    setIsUploading(true);

    let mediaData = {
      url: initialData?.mediaUrl || "",
      type: initialData?.mediaType || "none",
      publicId: initialData?.publicId || "", 
    };

    if (file) {
      const uploaded = await uploadToCloudinary(file);
      if (uploaded) {
        mediaData = uploaded;
      }
    }

    await onSubmit({
      title,
      content,
      mediaUrl: mediaData.url,
      mediaType: mediaData.type,
      publicId: mediaData.publicId,
      isDownloadable,
    });

    setIsUploading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {/* Title Input */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold opacity-70">Post Title</span>
          <span className={`label-text-alt font-mono ${title.length > T_LIMIT ? "text-error font-extrabold" : "opacity-50"}`}>
            {title.length}/{T_LIMIT}
          </span>
        </label>
        <input
          type="text"
          placeholder="Give your masterpiece a name..."
          className={`input input-bordered w-full bg-base-200/50 focus:border-primary ${title.length > T_LIMIT ? "input-error text-error" : ""}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Content Area */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold opacity-70">Content</span>
          <span className={`label-text-alt font-mono ${content.length > C_LIMIT ? "text-error font-extrabold" : "opacity-50"}`}>
            {content.length}/{C_LIMIT}
          </span>
        </label>
        <textarea
          placeholder="Tell the story behind this piece..."
          className={`textarea textarea-bordered w-full h-44 leading-relaxed bg-base-200/50 focus:border-primary ${content.length > C_LIMIT ? "textarea-error text-error" : ""}`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      {/* Media & Preview Section */}
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text font-bold opacity-70">Media Attachment</span>
        </label>
        
        {/* PREVIEW BOX */}
        {preview && (
          <div className="relative w-full aspect-video mb-4 rounded-xl overflow-hidden border border-base-300 bg-black/20 flex items-center justify-center">
            {file?.type.startsWith('video') || initialData?.mediaType === 'video' ? (
              <div className="flex flex-col items-center gap-2 opacity-60">
                <Film className="w-10 h-10" />
                <span className="text-xs font-bold uppercase tracking-widest">Video selected</span>
              </div>
            ) : (
              <img src={preview} className="w-full h-full object-contain" alt="Preview" />
            )}
            <button 
              type="button" 
              onClick={() => {setFile(null); setPreview(initialData?.mediaUrl || null)}}
              className="btn btn-circle btn-xs btn-error absolute top-2 right-2"
            >
              ×
            </button>
          </div>
        )}

        <input
          type="file"
          accept="image/*,video/*"
          className="file-input file-input-bordered file-input-primary w-full bg-base-200/50"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      {/* Download Toggle */}
      <div className="form-control bg-base-200 p-4 rounded-xl border border-base-300">
        <label className="label cursor-pointer justify-between">
          <span className="label-text font-bold opacity-70">Enable Download</span>
          <input
            type="checkbox"
            className="toggle toggle-primary"
            checked={isDownloadable}
            onChange={(e) => setIsDownloadable(e.target.checked)}
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading || isUploading || title.length > T_LIMIT || content.length > C_LIMIT}
        className="btn btn-primary w-full shadow-lg h-14 font-black uppercase tracking-widest"
      >
        {(isLoading || isUploading) ? (
          <>
            <Loader2 className="animate-spin w-5 h-5 mr-2" />
            {isUploading ? "UPLOADING MEDIA..." : "SAVING..."}
          </>
        ) : (
          initialData ? "Update Post" : "Publish Masterpiece"
        )}
      </button>
    </form>
  );
};

export default PostForm;