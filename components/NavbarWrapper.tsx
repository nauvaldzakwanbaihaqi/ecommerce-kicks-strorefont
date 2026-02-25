import Navbar from "./Navbar";
import CartCount from "./CartCount";

export default function NavbarWrapper() {
    return (
        <Navbar cartCountElement={<CartCount />} />
    );
}
