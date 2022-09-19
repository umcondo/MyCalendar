import styled from 'styled-components';

export const ModalContainer = styled.div`
	.modal-wapper {
		position: absolute;
		top: 40%;
		left: 50%;
		transform: translate(-50%, -50%);
		border-radius: 20px;
		background-color: #ececec;
		width: 300px;
		height: 400px;
		padding: 20px;
		box-sizing: border-box;
		z-index: 2;
	}

	.modal-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.3);
		z-index: 1;
	}
`;
