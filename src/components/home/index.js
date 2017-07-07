import {h, Component} from 'preact';
import s from './style';
import PongLoader from '../pong-loader';

export default class Home extends Component {
  render({message, isLoading, connectionError, videoSrc, imageSrc}) {
    return (
      <section class={s.home}>
        <div class={s.home_box}>
          {isLoading && (<PongLoader />)}

          {videoSrc && !isLoading &&
            (<video class={s.home_video} autoplay loop src={videoSrc} />)
          }

          {imageSrc && !isLoading &&
            (<img class={s.home_image} src={imageSrc} />)
          }

          {message && !videoSrc && !imageSrc && !isLoading &&
            (<div class={s.home_title}> {message} </div>)
          }

          {connectionError &&
            <div class={s.home_error}>
              {connectionError}
            </div>
          }
        </div>
      </section>
    );
  }
}
