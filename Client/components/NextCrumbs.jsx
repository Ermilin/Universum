import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { makeStyles } from '@material-ui/core/styles';
import Link from 'next/link';
import styles from 'styles/Home.module.css';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  container: {
    gridArea: '1 / 1',
  },
}));

const convertBreadcrumb = (string) => {
  return string
    .replace(/-/g, ' ')
    .replace(/%20/g, ' ')
    .replace(/oe/g, 'ö')
    .replace(/%C3%96/g, 'Ö')
    .replace(/ae/g, 'ä')
    .replace(/ue/g, 'ü');
};

const NextCrumbs = () => {
  const classes = useStyles();
  const router = useRouter();
  const [breadcrumbs, setBreadcrumbs] = useState(null);

  useEffect(() => {
    if (router) {
      const linkPath = router.asPath.split('/');
      linkPath.shift();

      const pathArray = linkPath.map((path, i) => {
        return {
          breadcrumb: path,
          href: '/' + linkPath.slice(0, i + 1).join('/'),
        };
      });

      setBreadcrumbs(pathArray);
    }
  }, [router]);

  if (!breadcrumbs) {
    return null;
  }

  return (
    <nav className={classes.container}>
      <Breadcrumbs
        aria-label='breadcrumb'
        separator='›'
        className={styles.breadcrumb}
      >
        <Link href='/'>
          <a>Universum</a>
        </Link>

        {breadcrumbs.map((breadcrumb, index) => {
          const last = index === breadcrumbs.length - 1;
          const { breadcrumb: crumb, href } = breadcrumb;

          return last ? (
            <Typography key={href}>
              <Box fontStyle='italic' color='text.primary'>
                {convertBreadcrumb(crumb)}
              </Box>
            </Typography>
          ) : (
            <Link href={href} key={href}>
              {convertBreadcrumb(crumb)}
            </Link>
          );
        })}
      </Breadcrumbs>
    </nav>
  );
};

export default NextCrumbs;
