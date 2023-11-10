import { useState } from 'react';
import TextResult from '@/components/textResult';

export default function Audios() {
  // const [input, setInput] = useState('')
  const [result, setResult] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onAudioChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const allowedExtensions = [
        '.mp3',
        '.mp4',
        '.mpeg',
        '.mpga',
        '.m4a',
        '.wav',
        '.webm',
      ];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      if (allowedExtensions.includes(`.${fileExtension}`)) {
        setSelectedFile(file);
      } else {
        alert('Invalid file type. Please select an audio file.');
        e.target.value = null;
      }
    }
  };

  async function onSubmit(event: any) {
    event.preventDefault();
    setLoading(true);
    if (!selectedFile) {
      alert('Please add the file')
      setLoading(false)
      return;
    }
    const formData = new FormData();
    console.log({ selectedFile });
    formData.append('file', selectedFile);
    try {
      const response = await fetch('/api/audios', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }
      setResult(data.result);
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
      <h1>TRANSCRIPT</h1>
      <form
        method="post"
        onSubmit={onSubmit}
        className="form-control w-full max-w-lg"
        encType="multipart/form-data"
      >
        <label className="label">
          <span className="label-text">Upload audio</span>
        </label>
        <input
          type="file"
          id="file-input"
          name="audio"
          className="file-input file-input-bordered w-full max-w-xs"
          accept=".mp3, .mp4, .mpeg, .mpga, .m4a, .wav, .webm"
          onChange={onAudioChange}
        />
        <label className="label"></label>
        <div className="flex justify-center">
          <button className="btn btn-primary" disabled={loading}>
            Generate transcript
          </button>
        </div>
      </form>
      {loading && <span className="loading loading-dots loading-lg"></span>}
      {result && <TextResult result={result} />}
    </div>
  );
}
