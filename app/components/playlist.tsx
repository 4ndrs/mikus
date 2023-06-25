type Props = { title: string };

const Playlist = ({ title }: Props) => (
  <div className="max-h-[28.75rem] overflow-hidden rounded-xl border border-gray-700">
    <div className="bg-gray-800 pl-4 pr-[0.38rem] pt-3">
      <h1 className="text-xl font-bold">{title}</h1>
      <p className="my-1 text-xs text-gray-400">1 / 2</p>
    </div>

    <div className="bg-gray-900">hello</div>
  </div>
);

export default Playlist;
