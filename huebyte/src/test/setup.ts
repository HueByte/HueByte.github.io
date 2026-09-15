import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Every page but the landing is React.lazy, so findBy* waits on a dynamic import. On a cold
// cache vitest can spend well over the 1s default just transforming the chunk.
configure({ asyncUtilTimeout: 10000 });

// Testing Library only auto-cleans when vitest globals are on; do it explicitly.
afterEach(cleanup);
