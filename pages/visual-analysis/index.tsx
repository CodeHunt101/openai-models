import { FormEvent, useState } from 'react';
import TextResult from '@/components/textResult';
import Image from 'next/image';

export default function VisualAnalysis() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [input, setInput] = useState('');
  const [selectedImageURL, setSelectedImageURL] = useState('');

  const onImageChange = (e: FormEvent<HTMLInputElement>) => {
    const fileInput = e.target as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp', '.gif'];
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedFile(file);
      } else {
        alert(
          'Invalid file type. Please select a PNG, JPEG, WEBP, or non-animated GIF file.'
        );
        fileInput.value = '';
      }
    }
  };

  const onTextChange = (e: FormEvent<HTMLTextAreaElement>) => {
    setInput((e.target as HTMLFormElement).value);
  };

  async function onSubmit(event: any) {
    event.preventDefault();
    setLoading(true);
    if (!selectedFile) {
      alert('Please add the file');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    console.log({ selectedFile });
    formData.append('file', selectedFile);
    formData.append('prompt', input);
    try {
      const response = await fetch('/api/visual-analysis', {
        method: 'POST',
        body: formData,
      });

      console.log({ response });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setSelectedImageURL(URL.createObjectURL(selectedFile));
      setResult(data.result);
      setInput('');
      // Reset the file input element here
      const fileInput = document.getElementById(
        'file-input'
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center mt-5">
      <h1>VISUAL ANALYSIS</h1>
      <form
        method="post"
        onSubmit={onSubmit}
        className="form-control w-full max-w-lg"
        encType="multipart/form-data"
      >
        <label className="label">
          <span className="label-text">Enter your prompt</span>
        </label>
        <textarea
          value={input}
          onChange={onTextChange}
          className="textarea textarea-primary textarea-lg"
        ></textarea>
        <input
          type="file"
          id="file-input"
          name="image"
          className="file-input file-input-bordered w-full max-w-xs"
          accept=".png, .jpeg, .jpg, .webp, .gif"
          onChange={onImageChange}
        />
        <label className="label"></label>
        <div className="flex justify-center">
          <button className="btn btn-primary" disabled={loading}>
            Generate response
          </button>
        </div>
      </form>
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {result && (
        <>
          <Image
            src={selectedImageURL}
            alt="Selected Image"
            width={512}
            height={512}
            className="selected-image my-4"
          />
          <TextResult result={result} />
        </>
      )}
    </div>
  );
}
