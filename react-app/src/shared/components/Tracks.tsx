import { FaPlay } from 'react-icons/fa';
import { ITrack } from '../../models';


export default function Tracks({ tracks }: { tracks: ITrack[] }) {
  return <>{ tracks && tracks.map(p => {
    return <div key={ p.id }
                className="flex items-center">
      <div className="mr-3">
        <FaPlay/>
      </div>
      <div>
        { p.title }
      </div>
    </div>;
  }) }</>;
}
