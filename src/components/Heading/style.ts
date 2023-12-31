import { theme } from "@/styles/theme";
import styled from "styled-components";

export const StyledHeader = styled.div`
  width: 100%;
  height: 4rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .container {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    letter-spacing: 0.04rem;

    p {
      font-size: 0.9rem;
      font-weight: 500;
    }
  }

    .theme-modal {
      position: absolute;
      top: 0;
      right: 10px;
    }

`;
