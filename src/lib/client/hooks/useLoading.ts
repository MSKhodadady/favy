"use client";

import { useState } from "react";

export function useLoading() {
  const [loading, setLoading] = useState(false);

  function withLoading(f: () => Promise<any> | any) {
    setLoading(true);

    Promise.resolve(f()).then((res) => {
      setLoading(false);

      return res;
    });
  }

  return { loading, setLoading, withLoading };
}
