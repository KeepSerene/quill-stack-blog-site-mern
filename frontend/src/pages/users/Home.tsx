/**
 * @copyright 2025 Dhrubajyoti Bhattacharjee
 * @license Apache-2.0
 */

import Page from "@/components/Page";
import Hero from "@/components/home/Hero";
import RecentBlogs from "@/components/home/RecentBlogs";
import AllBlogs from "@/components/home/AllBlogs";

function Home() {
  return (
    <Page>
      <Hero />

      <RecentBlogs />

      <AllBlogs />
    </Page>
  );
}

export default Home;
