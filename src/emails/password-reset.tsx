import { emailStyles } from "@/emails/styles";
import {
	Body,
	Button,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Text,
} from "@react-email/components";

interface PasswordResetProps {
	resetUrl: string;
	userName?: string;
}

export const PasswordReset = ({ resetUrl, userName }: PasswordResetProps) => {
	return (
		<Html>
			<Head />
			<Preview>Reset your password</Preview>
			<Body style={emailStyles.main}>
				<Container style={emailStyles.container}>
					<Heading style={emailStyles.h1}>Password Reset</Heading>
					{userName ? (
						<Text style={emailStyles.text}>Hello {userName},</Text>
					) : (
						<Text style={emailStyles.text}>Hello,</Text>
					)}
					<Text style={emailStyles.text}>
						Please click the button below to reset your password.
					</Text>
					<Section style={emailStyles.buttonContainer}>
						<Button style={emailStyles.button} href={resetUrl}>
							Reset Password
						</Button>
					</Section>
					<Hr style={emailStyles.hr} />
					<Text style={emailStyles.footer}>
						If you didn't expect this email, please ignore it.
					</Text>
				</Container>
			</Body>
		</Html>
	);
};

export default PasswordReset;
