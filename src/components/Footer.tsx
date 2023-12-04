import { FacebookOutlined, InstagramOutlined, TwitterOutlined} from '@ant-design/icons';
import "./footer.css";

const FooterContainer = () => {
    return (
      <footer>
      <div className="footer-content">
        <h3 style = {{color: "white", fontFamily: "Arial Black" }}>Project Title</h3>
        <ul className="socials">
          <li>
            <a href="#">
              +38 000 00 00 000
            </a>
          </li>
          <li>
            <a href="#">
               Adress
            </a>
          </li>
          <li style ={{fontSize: 32}}>
            <FacebookOutlined />
            <InstagramOutlined />
            <TwitterOutlined />
          </li>
        </ul>
      </div>
    </footer>
    );
  };
  export default FooterContainer;