import type { LegacyRef } from "react";
import useRepos from "@/hooks/useRepos";

import RepoListItem, { RepoListItemSkeletons } from "./RepoListItem";

export const RepoList = () => {
  const { repos, loading, fetchMore } = useRepos(10);
  const bottomRef: LegacyRef<HTMLDivElement> = (element) => {
    if (element) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting && !loading) {
            fetchMore().catch(console.error);
          }
        },
        { threshold: 1 }
      );
      observer.observe(element);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {repos.map((repo) => (
          <RepoListItem key={repo.id} repo={repo} />
        ))}
        {loading && <RepoListItemSkeletons count={10} />}
      </div>
      <div ref={bottomRef} />
    </>
  );
};

export default RepoList;
