import Image from 'next/image';
import Link from 'next/link';
import JsonLd from './components/JsonLd';
import JunFace from './components/JunFace';
import robotStyles from './components/RobotGuide.module.css';
import { getProject, projects } from './content/projects';
import { ASK_PATH } from './content/site';
import styles from './PortfolioHome.module.css';

const leadProject = getProject('bgneye-jamsil') ?? projects[0];

export default function PortfolioHome() {
  const heroImage = leadProject.media.find(({ type }) => type === 'image');
  const leadHref = `/projects/${leadProject.slug}`;

  return (
    <div className={styles.home}>
      <JsonLd />
      <section className={styles.hero} aria-labelledby="featured-title">
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>대표 프로젝트</p>
          <h1 id="featured-title" className={styles.heroTitle}>{leadProject.title}</h1>
          <div className={styles.actions}>
            <Link href={leadHref} className={styles.primary}>프로젝트 보기 <span aria-hidden="true">↗</span></Link>          </div>
        </div>
        <figure className={styles.feature}>
          <Link href={leadHref} className={styles.featureImage} aria-label={`${leadProject.title} 상세 보기`}>
            {heroImage && <Image src={heroImage.src} alt={heroImage.alt} fill priority sizes="(max-width: 800px) 100vw, 62vw" />}
          </Link>
          <figcaption className={styles.featureCaption}>
            <span>{leadProject.summary}</span>
            <span className={styles.duration}>{leadProject.duration}</span>
          </figcaption>
        </figure>
      </section>

      <section id="projects" className={styles.projects} aria-labelledby="projects-title">
        <h2 id="projects-title">다른 프로젝트</h2>
        <ul className={styles.projectGrid}>
          {projects.filter(project => project.slug !== leadProject.slug).map(project => {
            const thumbnail = project.media.find(({ type }) => type === 'image');
            return (
              <li key={project.slug}>
                <Link href={`/projects/${project.slug}`} className={styles.project}>
                  <span className={styles.thumb} aria-hidden="true">
                    {thumbnail && (
                      <Image
                        src={thumbnail.src}
                        alt=""
                        fill
                        sizes="(min-width: 1224px) 374px, (min-width: 960px) 33vw, (min-width: 560px) 50vw, calc(100vw - 32px)"
                      />
                    )}
                  </span>
                  <div className={styles.projectCopy}>
                    <h3>{project.title}</h3>
                    <p>{project.summary}</p>
                  </div>
                  <div className={styles.projectMeta}>
                    <span>{project.tags[0]}</span>
                    <span className={styles.projectYear}>{project.duration.slice(0, 4)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.ask} aria-labelledby="ask-title">
        <div>
          <h2 id="ask-title">궁금한 점이 있나요?</h2>
          <p>Jun 에게 물어봐 주세요.</p>
        </div>
        {/* 커서를 따라 고개를 돌리는 Jun의 머리. 누르면 전체 대화로 간다. */}
        <Link href={ASK_PATH} aria-label="Jun에게 묻기" title="Jun에게 묻기" className={`${styles.askJun} ${robotStyles.artwork}`}>
          <JunFace />
        </Link>
      </section>
    </div>
  );
}
