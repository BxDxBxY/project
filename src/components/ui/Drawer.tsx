"use client";

import * as React from "react";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FormatColorTextIcon from "@mui/icons-material/FormatColorText";
import ClassTwoToneIcon from "@mui/icons-material/ClassTwoTone";
import DrawTwoToneIcon from "@mui/icons-material/DrawTwoTone";
import GroupTwoToneIcon from "@mui/icons-material/GroupTwoTone";
import Link from "next/link";
import { Button, useMediaQuery } from "@mui/material";

const drawerWidth = 240;

// Drawer open/close mixins
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.snackbar + 1, // ensures snackbars show above
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function MiniDrawer({
  children,
  handleLogout,
}: {
  children: React.ReactNode;
  handleLogout: () => void;
}) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  // Mobile check
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const navigationPanelInfo = [
    { text: "Terminlar", icon: <FormatColorTextIcon />, url: "/admin/terms" },
    { text: "Kategoriyalar", icon: <ClassTwoToneIcon />, url: "/admin/categories" },
    { text: "Foydalanuvchilar", icon: <GroupTwoToneIcon />, url: "/admin/users" },
    { text: "Drafts", icon: <DrawTwoToneIcon />, url: "#" },
  ];

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);
  const toggleMobileDrawer = () => setMobileOpen(!mobileOpen);

  // Drawer content
  const drawerContent = (
    <div className="h-full flex flex-col">
      <DrawerHeader>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold">
            A
          </div>
          <Button
            variant="text"
            size="small"
            color="primary"
            className="text-sm text-blue-600 hover:underline"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
        {!isMobile && (
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </DrawerHeader>
      <Divider />
      <List className="flex-1">
        {navigationPanelInfo.map((item, index) => (
          <Link key={index} href={item.url}>
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open || isMobile
                    ? { justifyContent: "initial" }
                    : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: "center" },
                    open || isMobile ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={[open || isMobile ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
      <Divider />
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      {/* AppBar */}
      <AppBar position="fixed" open={open && !isMobile}>
        <Toolbar className="flex justify-between">
          <div className="flex items-center gap-2">
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={isMobile ? toggleMobileDrawer : handleDrawerOpen}
              edge="start"
              sx={{ marginRight: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Admin Panel
            </Typography>
          </div>
        </Toolbar>
      </AppBar>

      {/* Desktop drawer */}
      {!isMobile && (
        <Drawer variant="permanent" open={open}>
          {drawerContent}
        </Drawer>
      )}

      {/* Mobile drawer */}
      {isMobile && (
        <MuiDrawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleMobileDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": { width: drawerWidth, boxSizing: "border-box" },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      )}

      {/* Main content */}
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3 }}
        className="bg-gray-50 min-h-screen"
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}


        // <List>
        //   {["All mail", "Trash", "Spam"].map((text, index) => (
        //     <ListItem key={text} disablePadding sx={{ display: "block" }}>
        //       <ListItemButton
        //         sx={[
        //           {
        //             minHeight: 48,
        //             px: 2.5,
        //           },
        //           open
        //             ? {
        //                 justifyContent: "initial",
        //               }
        //             : {
        //                 justifyContent: "center",
        //               },
        //         ]}
        //       >
        //         <ListItemIcon
        //           sx={[
        //             {
        //               minWidth: 0,
        //               justifyContent: "center",
        //             },
        //             open
        //               ? {
        //                   mr: 3,
        //                 }
        //               : {
        //                   mr: "auto",
        //                 },
        //           ]}
        //         >
        //           {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        //         </ListItemIcon>
        //         <ListItemText
        //           primary={text}
        //           sx={[
        //             open
        //               ? {
        //                   opacity: 1,
        //                 }
        //               : {
        //                   opacity: 0,
        //                 },
        //           ]}
        //         />
        //       </ListItemButton>
        //     </ListItem>
        //   ))}
        // </List>