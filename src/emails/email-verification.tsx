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
import { emailStyles } from "@/emails/styles";

interface EmailVerificationProps {
	verificationUrl: string;
	userName?: string;
}

export const EmailVerification = ({
	verificationUrl,
	userName,
}: EmailVerificationProps) => {
	return (
		<Html>
			<Head />
			<Preview>Verify your email address</Preview>
			<Body style={emailStyles.main}>
				<Container style={emailStyles.container}>
					<Heading style={emailStyles.h1}>Email Verification</Heading>
					{userName ? (
						<Text style={emailStyles.text}>Hello {userName},</Text>
					) : (
						<Text style={emailStyles.text}>Hello,</Text>
					)}
					<Text style={emailStyles.text}>
						Please click the button below to verify your email address.
					</Text>
					<Section style={emailStyles.buttonContainer}>
						<Button style={emailStyles.button} href={verificationUrl}>
							Verify Email
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

export default EmailVerification;
