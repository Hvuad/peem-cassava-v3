import { Container, Row, Col, Card, Form, Button } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { api } from "../lib/api"
import { useUserStore } from "../stores/user.store"

const loginSchema = z.object({
	username: z.string().min(1, "Username is required"),
	password: z.string().min(1, "Password must be at least 1 characters"),
})

type LoginFormData = z.infer<typeof loginSchema>

export const Login = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
	})

	const loginMutation = useMutation({
		mutationFn: async (data: LoginFormData) => {
			const res = await api.api.v1.auth.login.$post({
				json: data,
			})
			return res.json()
		},
		onSuccess: (data) => {
			useUserStore.setState({ user: data })
			toast.success("Logged in successfully")
		}
	})

	const onSubmit = (data: LoginFormData) => {
		loginMutation.mutate(data)
	}

	console.log("🚀 ~ Login ~ errors.password:", errors)
	return (
		<div className="bg-light min-vh-100 d-flex align-items-center">
			<Container>
				<Row className="justify-content-center">
					<Col md={6} lg={5} xl={4}>
						<Card className="shadow-lg border-0">
							<Card.Body className="p-5">
								<div className="text-center mb-4">
									<h2 className="fw-bold text-primary mb-2">Welcome Back</h2>
									<p className="text-muted">Sign in to your account</p>
								</div>

								<Form onSubmit={handleSubmit(onSubmit)}>
									<Form.Group className="mb-3">
										<Form.Label>Username</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter username"
											{...register("username")}
											isInvalid={!!errors.username}
											size="lg"
										/>
										<Form.Control.Feedback type="invalid">
											{errors.username?.message}
										</Form.Control.Feedback>
									</Form.Group>

									<Form.Group className="mb-3">
										<Form.Label>Password</Form.Label>
										<Form.Control
											type="password"
											placeholder="Enter password"
											{...register("password")}
											isInvalid={!!errors.password}
											size="lg"
										/>
										<Form.Control.Feedback type="invalid">
											{errors.password?.message}
										</Form.Control.Feedback>
									</Form.Group>

									<Button
										variant="primary"
										type="submit"
										className="w-100 py-2 fw-semibold"
										size="lg"
										disabled={loginMutation.isPending}
									>
										{loginMutation.isPending ? "Signing in..." : "Sign In"}
									</Button>
								</Form>
							</Card.Body>
						</Card>

						<div className="text-center mt-4">
							<small className="text-muted">
								© 2026 Your Company. All rights reserved.
							</small>
						</div>
					</Col>
				</Row>
			</Container>
		</div>
	)
}
