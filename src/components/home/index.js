import {h, Component} from 'preact';
import s from './style';
import PongLoader from '../pong-loader';

export default class Home extends Component {
  componentWillReceiveProps({imageSrc}) {
    this.setState({imageWidth: null, imageHeight: null});

    if (!imageSrc) {
      return;
    }

    const img = new Image();
    img.onload = () => {
      this.setState({imageWidth: img.width, imageHeight: img.height});
    };
    img.src = imageSrc;
  }

  render({message, isLoading, connectionError, videoSrc, imageSrc}, {imageWidth, imageHeight}) {
    let imgStyle = '';

    if (imageWidth && imageHeight) {
      if ((imageWidth / imageHeight) > (window.innerWidth / window.innerHeight)) {
        imgStyle = `width: ${window.innerWidth - 100}px`;
      } else {
        imgStyle = `width: ${window.innerHeight - 100}px`;
      }
    }

    return (
      <section class={s.home}>
        <div class={s.home_box}>
          {isLoading && (<PongLoader />)}

          {videoSrc && !isLoading &&
            (<video class={s.home_video} autoplay loop src={videoSrc} />)
          }

          {imageSrc && !isLoading &&
            (<img class={s.home_image} src={imageSrc} style={imgStyle} />)
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
