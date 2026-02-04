import Container from "react-bootstrap/Container"
import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"

import { useUserStore } from "../stores/user.store"

export function NavbarCustom() {
	const user = useUserStore((v) => v.user)
	return (
		<Navbar expand="lg" className="bg-body-tertiary">
			<Container fluid>
				<Navbar.Brand href="#home">Peem cassava</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						<Nav.Link href="#home">Cassava</Nav.Link>
						<Nav.Link href="#link">Accountant</Nav.Link>
						<Nav.Link href="#link">Cash</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				<Nav>
					<Nav.Link href="#deets">{user?.username}</Nav.Link>
					<Nav.Link
						eventKey={2}
						onClick={() => useUserStore.setState({ user: undefined })}
					>
						Logout
					</Nav.Link>
				</Nav>
			</Container>
		</Navbar>
	)
}
