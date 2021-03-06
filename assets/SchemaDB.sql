PGDMP     &    (            
    x            tl    10.14 (Debian 10.14-1.pgdg90+1)    11.2     *           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            +           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            ,           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            -           1262    57693    tl    DATABASE     r   CREATE DATABASE tl WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.utf8' LC_CTYPE = 'en_US.utf8';
    DROP DATABASE tl;
             amari    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            .           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    3            �            1259    57694 	   blueStats    TABLE       CREATE TABLE public."blueStats" (
    "guildID" text NOT NULL,
    hunger integer NOT NULL,
    affection integer NOT NULL,
    hype integer NOT NULL,
    "doubleDrain" boolean NOT NULL,
    dead boolean NOT NULL,
    channel text,
    "timesDied" integer,
    "lastDeath" date
);
    DROP TABLE public."blueStats";
       public         amari    false    3            �            1259    65885    user    TABLE     �   CREATE TABLE public."user" (
    "userID" text NOT NULL,
    "guildID" text NOT NULL,
    fed integer,
    cheer integer,
    pet integer,
    "fedLimit" integer,
    "limitReached" text
);
    DROP TABLE public."user";
       public         amari    false    3            &          0    57694 	   blueStats 
   TABLE DATA               �   COPY public."blueStats" ("guildID", hunger, affection, hype, "doubleDrain", dead, channel, "timesDied", "lastDeath") FROM stdin;
    public       amari    false    196   �       '          0    65885    user 
   TABLE DATA               b   COPY public."user" ("userID", "guildID", fed, cheer, pet, "fedLimit", "limitReached") FROM stdin;
    public       amari    false    197   !       �
           2606    57701    blueStats blueStats_pkey 
   CONSTRAINT     a   ALTER TABLE ONLY public."blueStats"
    ADD CONSTRAINT "blueStats_pkey" PRIMARY KEY ("guildID");
 F   ALTER TABLE ONLY public."blueStats" DROP CONSTRAINT "blueStats_pkey";
       public         amari    false    196            �
           2606    65892    user user_pkey 
   CONSTRAINT     _   ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY ("userID", "guildID");
 :   ALTER TABLE ONLY public."user" DROP CONSTRAINT user_pkey;
       public         amari    false    197    197            &   6   x�336716110301310053�440�0�4�L¼��TN�?�=... �	]      '      x������ � �     