<template>
<div class="page" :class="{'is-collapse': collapse }">
  <mu-appbar color="primary" class="page-header" :z-depth="1">
    <mu-button icon slot="left" @click="toggleMenu">
      <mu-icon value="menu"/>
    </mu-button>
    {{ title }}
    <mu-button icon slot="right" @click="toggleTheme">
      <mu-icon :value="theme === 'light' ? 'lightbulb_outline' : 'lightbulb'" />
    </mu-button>
  </mu-appbar>
  <mu-drawer open docked :z-depth="0" class="page-side-bar">
    <mu-appbar class="nav-appbar" :z-depth="0" color="transparent" :title="collapse ? 'Ka' : 'KindnessAPI'">
    </mu-appbar>
    <mu-divider />
    <mu-list>
      <mu-list-item button to="/" active-class="active-link">
        <mu-list-item-action>
          <mu-icon value="apps"/>
        </mu-list-item-action>
        <mu-list-item-title>Home</mu-list-item-title>
      </mu-list-item>
      <mu-list-item button to="/blog" active-class="active-link">
        <mu-list-item-action>
          <mu-icon value="info"/>
        </mu-list-item-action>
        <mu-list-item-title>Blog</mu-list-item-title>
      </mu-list-item>
    </mu-list>
  </mu-drawer>
  <nuxt @title="(v) => { title = v }" />
</div>
</template>

<script>
import theme from 'muse-ui/lib/theme';
export default {
  data () {
    return {
      title: '',
      theme: 'light',
      collapse: true
    }
  },
  mounted () {
    theme.use(this.theme);
    this.collapse = window.innerWidth < 500
  },
  methods: {
    toggleTheme () {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      theme.use(this.theme);
    },
    toggleMenu () {
      this.collapse = !this.collapse;
    }
  }
};
</script>


<style lang="less">
@import url('../assets/Geomanist-Regular-Webfont/stylesheet.css');
@panelw: 256px;
@collapsew: 56px;

.page.is-collapse .mu-appbar-title{
  justify-content: center;
}
.nav-appbar {
  .mu-appbar-title {
    line-height: 1;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    color: rgba(0, 0, 0, .54);
    > img {
      width: 36px;
      height: 36px;
      margin-right: 8px;
    }
  }
}
.page {
  padding-left: @panelw;
  &.is-collapse {
    padding-left: @collapsew;
  }
}
.page-header {
  position: fixed;
  left: @panelw;
  top: 0;
  right: 0;
  transition: all .45s cubic-bezier(0.23, 1, 0.32, 1);
  .page.is-collapse & {
    left: @collapsew;
  }
}
.nuxt-link-exact-active {
  .mu-item-action {
    color: #2196f3;
  }
  .mu-item {
    color: #2196f3;
  }
}
.page-side-bar {
  width: @panelw;
  transition: all .45s cubic-bezier(0.23, 1, 0.32, 1);
  .page.is-collapse & {
    width: @collapsew;
  }
}
body {
  font-family: geomanistregular, Roboto, Lato, sans-serif;
  line-height: 1.5;
  font-size: 14px;
  font-weight: 400;
  width: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.144);
  background-color: #fafafa;
  color: rgba(0,0,0,.87);
}
</style>

